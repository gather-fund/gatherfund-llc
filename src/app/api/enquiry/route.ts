import { TOPICS } from '@/lib/site';
import type { Topic } from '@/lib/site';

// Receives an enquiry from the contact dialog and forwards it as JSON to ENQUIRY_WEBHOOK_URL (set at run time,
// for example an email or form service). Until that is configured nothing can be delivered, so the endpoint
// answers 503 and the dialog tells the visitor their enquiry was not sent and offers to copy it instead.

const LIMITS = { name: 200, email: 320, message: 5000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Enquiry = { name: string; email: string; topic: Topic; message: string };

function parse(body: unknown): Enquiry | null {
  if (typeof body !== 'object' || body === null) return null;
  const record = body as Record<string, unknown>;
  const text = (key: keyof typeof LIMITS) => {
    const value = record[key];
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed && trimmed.length <= LIMITS[key] ? trimmed : null;
  };
  const name = text('name');
  const email = text('email');
  const message = text('message');
  const topic = TOPICS.find(option => option === record['topic']);
  if (!name || !email || !EMAIL.test(email) || !message || !topic) return null;
  return { name, email, topic, message };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }
  const enquiry = parse(body);
  if (!enquiry) return Response.json({ error: 'invalid_enquiry' }, { status: 422 });

  const target = process.env['ENQUIRY_WEBHOOK_URL'];
  if (!target) return Response.json({ error: 'not_configured' }, { status: 503 });

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return Response.json({ error: 'delivery_failed' }, { status: 502 });
  } catch {
    return Response.json({ error: 'delivery_failed' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
