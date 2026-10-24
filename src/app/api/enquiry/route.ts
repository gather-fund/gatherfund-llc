import { checkEnquiry } from '@/lib/enquiry';
import { TOPICS } from '@/lib/site';

// Receives an enquiry from the contact dialog and forwards it as JSON to ENQUIRY_WEBHOOK_URL (set at run time,
// for example an email or form service). Until that is configured nothing can be delivered, so the endpoint
// answers 503 and the dialog tells the visitor their enquiry was not sent and offers to copy it instead.

const MAX_BODY_BYTES = 16 * 1024;

// A basic per-address limit. It lives in this server's memory, so it resets on restart and is not shared between
// instances; a platform or firewall rate limit should replace it once the site is hosted.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function clientAddress(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function overLimit(address: string, now: number): boolean {
  const times = (recent.get(address) ?? []).filter(time => now - time < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) {
    recent.set(address, times);
    return true;
  }
  times.push(now);
  recent.set(address, times);
  if (recent.size > 10_000) {
    for (const [key, value] of recent) if (value.every(time => now - time >= WINDOW_MS)) recent.delete(key);
  }
  return false;
}

// Only this site's own pages may post here. Browsers always send Origin on a cross-site POST.
function sameSite(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const fail = (status: number, error: string, extra?: object) => Response.json({ error, ...extra }, { status });

export async function POST(request: Request) {
  if (!sameSite(request)) return fail(403, 'forbidden');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return fail(415, 'unsupported_media_type');
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return fail(413, 'too_large');

  // The body may arrive without a length header, so the read itself stops at the limit.
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return fail(413, 'too_large');
      }
      chunks.push(value);
    }
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, 'invalid_json');
  }

  // A field people never see. Bots that fill it get a normal-looking answer and nothing is forwarded.
  if (typeof body['website'] === 'string' && body['website'] !== '') return Response.json({ ok: true });

  if (overLimit(clientAddress(request), Date.now())) return fail(429, 'too_many_requests');

  if (!TOPICS.some(option => option === body['topic'])) return fail(422, 'invalid_enquiry', { fields: {} });
  const result = checkEnquiry(body);
  if (!result.enquiry) return fail(422, 'invalid_enquiry', { fields: result.errors });

  const target = process.env['ENQUIRY_WEBHOOK_URL'];
  if (!target) {
    console.error('enquiry not delivered: ENQUIRY_WEBHOOK_URL is not set');
    return fail(503, 'not_configured');
  }

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...result.enquiry, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error('enquiry delivery failed', { status: response.status });
      return fail(502, 'delivery_failed');
    }
  } catch (error) {
    // Never log the enquiry or the webhook address.
    console.error('enquiry delivery failed', { error: error instanceof Error ? error.name : 'unknown' });
    return fail(502, 'delivery_failed');
  }
  return Response.json({ ok: true });
}
