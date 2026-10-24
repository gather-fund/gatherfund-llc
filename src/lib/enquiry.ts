import { TOPICS } from './site';
import type { Topic } from './site';

// One set of rules for the contact form and /api/enquiry, so the server never rejects what the form accepted.

export const LIMITS = { name: 200, email: 320, message: 5000 } as const;
export type Field = keyof typeof LIMITS;
export type Enquiry = { name: string; email: string; topic: Topic; message: string };
export type FieldErrors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Line breaks and tabs are fine in a message; no other control characters are, anywhere.
const CONTROL = /[\u0000-\u001f\u007f]/;
const CONTROL_IN_MESSAGE = /[\u0000-\u0008\u000b-\u001f\u007f]/;

const count = (n: number) => new Intl.NumberFormat('en').format(n);

export function checkEnquiry(input: { name?: unknown; email?: unknown; topic?: unknown; message?: unknown }):
  { enquiry: Enquiry; errors?: undefined } | { enquiry?: undefined; errors: FieldErrors } {
  const text = (value: unknown) => (typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '');
  const name = text(input.name);
  const email = text(input.email);
  const message = text(input.message);
  const errors: FieldErrors = {};

  if (!name) errors.name = 'Enter your name.';
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${count(LIMITS.name)} characters.`;
  else if (CONTROL.test(name)) errors.name = 'Enter your name on one line, without tabs.';

  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > LIMITS.email || CONTROL.test(email) || !EMAIL.test(email)) errors.email = 'Enter an email address in the format name@example.com.';

  if (!message) errors.message = 'Enter a message.';
  else if (message.length > LIMITS.message) errors.message = `Keep your message under ${count(LIMITS.message)} characters. It is ${count(message.length)} now.`;
  else if (CONTROL_IN_MESSAGE.test(message)) errors.message = 'Remove the hidden formatting characters from your message, then try again.';

  if (Object.keys(errors).length > 0) return { errors };
  const topic = TOPICS.find(option => option === input.topic) ?? TOPICS[TOPICS.length - 1]!;
  return { enquiry: { name, email, topic, message } };
}
