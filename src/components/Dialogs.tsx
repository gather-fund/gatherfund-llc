'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent, PointerEvent, ReactNode, RefObject } from 'react';
import { checkEnquiry } from '@/lib/enquiry';
import type { Enquiry, Field, FieldErrors } from '@/lib/enquiry';
import { company, TOPICS } from '@/lib/site';
import type { Topic } from '@/lib/site';
import { CloseIcon, ErrorIcon } from './Icons';

type DialogControls = {
  openContact: (topic?: Topic) => void;
  openVenture: () => void;
};

const DialogContext = createContext<DialogControls | null>(null);

export function useDialogs(): DialogControls {
  const controls = useContext(DialogContext);
  if (!controls) throw new Error('useDialogs must be used inside <DialogProvider>');
  return controls;
}

function onBackdrop(event: { target: EventTarget; currentTarget: HTMLDialogElement; clientX: number; clientY: number }): boolean {
  const dialog = event.currentTarget;
  if (event.target !== dialog) return false;
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
}

// Closes on a press that both starts and ends on the backdrop, so selecting text and releasing outside the box
// never closes the dialog.
function useBackdropClose(onClose: () => void) {
  const pressedOnBackdrop = useRef(false);
  return {
    onPointerDown: (event: PointerEvent<HTMLDialogElement>) => { pressedOnBackdrop.current = onBackdrop(event); },
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      const close = pressedOnBackdrop.current && onBackdrop(event);
      pressedOnBackdrop.current = false;
      if (close) onClose();
    },
  };
}

function focusLater(selector: string) {
  requestAnimationFrame(() => document.querySelector<HTMLElement>(selector)?.focus());
}

// The provider sits in the root layout, so the enquiry the visitor is writing survives a visit to the privacy notice.
export function DialogProvider({ children }: { children: ReactNode }) {
  const contactRef = useRef<HTMLDialogElement>(null);
  const ventureRef = useRef<HTMLDialogElement>(null);
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [contactOpenCount, setContactOpenCount] = useState(0);

  const openContact = useCallback((nextTopic?: Topic) => {
    if (nextTopic) setTopic(nextTopic);
    contactRef.current?.showModal();
    setContactOpenCount(count => count + 1);
  }, []);
  const openVenture = useCallback(() => {
    ventureRef.current?.showModal();
    focusLater('#venture-dialog-title');
  }, []);
  const controls = useMemo(() => ({ openContact, openVenture }), [openContact, openVenture]);

  return (
    <DialogContext.Provider value={controls}>
      {children}
      <ContactDialog dialogRef={contactRef} topic={topic} onTopicChange={setTopic} openCount={contactOpenCount} />
      <VentureDialog
        dialogRef={ventureRef}
        onAsk={() => {
          ventureRef.current?.close();
          openContact('Gatherfund');
        }}
      />
    </DialogContext.Provider>
  );
}

type Phase = 'form' | 'sending' | 'sent' | 'failed' | 'copy';
type Details = Enquiry;
// Why the last send failed: the service could not deliver it, or this address sent too many in a short time.
type Failure = 'delivery' | 'rate';

function ContactDialog({ dialogRef, topic, onTopicChange, openCount }: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  topic: Topic;
  onTopicChange: (topic: Topic) => void;
  openCount: number;
}) {
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<Phase>('form');
  const [failure, setFailure] = useState<Failure>('delivery');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [waitNote, setWaitNote] = useState(false);
  const [sent, setSent] = useState<Details | null>(null);
  const [enquiry, setEnquiry] = useState('');
  const [copied, setCopied] = useState<boolean | null>(null);
  const enquiryRef = useRef<HTMLTextAreaElement>(null);
  const sending = phase === 'sending';
  // Read inside event handlers that may run before React re-renders.
  const sendingRef = useRef(false);
  const phaseRef = useRef<Phase>('form');
  useLayoutEffect(() => { phaseRef.current = phase; }, [phase]);

  // Each time the dialog opens, focus goes to the first field, or to the heading when there is no form to fill in.
  // Text prepared for copying is not kept across opens: the topic may have changed, so the form comes back.
  useEffect(() => {
    if (openCount === 0) return;
    if (phaseRef.current === 'copy') {
      setCopied(null);
      setPhase('form');
      focusLater('#f-name');
      return;
    }
    focusLater(phaseRef.current === 'form' || phaseRef.current === 'failed' ? '#f-name' : '#contact-title');
  }, [openCount]);

  // The dialog stays open while an enquiry is sending, so the visitor always learns whether it was sent.
  function askToWait() {
    setWaitNote(true);
    requestAnimationFrame(() => document.getElementById('send-wait')?.scrollIntoView({ block: 'nearest' }));
  }

  function close() {
    if (sendingRef.current) { askToWait(); return; }
    dialogRef.current?.close();
  }

  function onClosed() {
    // Browsers without closedby can still let a repeated Escape through while sending: reopen and explain.
    if (sendingRef.current) {
      dialogRef.current?.showModal();
      askToWait();
      return;
    }
    // A sent enquiry is finished: the next time the dialog opens it starts a new one.
    if (phaseRef.current === 'sent') {
      setPhase('form');
      setSent(null);
      setValues(current => ({ ...current, message: '' }));
    }
  }

  function onField(field: Field) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (sendingRef.current) return;
      setValues(current => ({ ...current, [field]: event.target.value }));
      setErrors(current => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    };
  }

  function showErrors(next: FieldErrors) {
    setErrors(next);
    const first = (['name', 'email', 'message'] as const).find(key => next[key]);
    if (first) focusLater(`#f-${first}`);
  }

  // Returns the checked details, or shows the errors, moves focus to the first one and returns null.
  function check(): Details | null {
    const result = checkEnquiry({ ...values, topic });
    if (!result.enquiry) {
      showErrors(result.errors);
      return null;
    }
    setErrors({});
    return result.enquiry;
  }

  async function send(event?: FormEvent) {
    event?.preventDefault();
    if (sendingRef.current) return;
    const details = check();
    if (!details) return;
    sendingRef.current = true;
    setWaitNote(false);
    setPhase('sending');
    let outcome: 'sent' | 'invalid' | Failure = 'delivery';
    let fields: FieldErrors = {};
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, website: honeypotRef.current?.value ?? '' }),
      });
      if (response.ok) outcome = 'sent';
      else if (response.status === 429) outcome = 'rate';
      else if (response.status === 422) {
        // The server found a problem the form did not: show it on the field, as the form would.
        const body: unknown = await response.json().catch(() => null);
        const reported = (body as { fields?: FieldErrors } | null)?.fields;
        if (reported && Object.keys(reported).length > 0) {
          outcome = 'invalid';
          fields = reported;
        }
      }
    } catch {
      outcome = 'delivery';
    }
    sendingRef.current = false;
    setWaitNote(false);
    if (outcome === 'sent') {
      setSent(details);
      setPhase('sent');
      focusLater('#sent-done');
    } else if (outcome === 'invalid') {
      setPhase('form');
      showErrors(fields);
    } else {
      setFailure(outcome);
      setPhase('failed');
      focusLater('#send-enquiry');
    }
  }

  function prepare() {
    if (sendingRef.current) return;
    const details = check();
    if (!details) return;
    setCopied(null);
    setEnquiry(`Gatherfund LLC enquiry\n\nName: ${details.name}\nEmail: ${details.email}\nTopic: ${details.topic}\n\n${details.message}`);
    setPhase('copy');
    focusLater('#copy-enquiry');
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(enquiry);
      setCopied(true);
    } catch {
      enquiryRef.current?.focus();
      enquiryRef.current?.select();
      setCopied(false);
    }
  }

  const status = copied === true
    ? ['Copied', `Paste your enquiry into an email to ${company.contactEmail}. Nothing has been sent from this page.`]
    : copied === false
      ? ['Not copied', 'Your browser blocked copying. The enquiry is selected below, so use your device’s copy command.']
      : ['Ready to copy', `Nothing has been sent. Copy your enquiry and paste it into an email to ${company.contactEmail}.`];

  const showForm = phase === 'form' || phase === 'sending' || phase === 'failed';
  const backdrop = useBackdropClose(close);
  // closedby="none" stops Escape and other close requests while sending (Chrome 134 and later); onClosed covers the rest.
  const closedBy = { closedby: sending ? 'none' : 'any' } as Record<string, string>;
  const fieldClass = (field: Field) => (errors[field] ? 'field invalid' : 'field');
  const describedBy = (field: Field, hint?: string) => [hint, errors[field] ? `f-${field}-error` : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <dialog
      className="dlg"
      id="contact-dialog"
      ref={dialogRef}
      aria-labelledby="contact-title"
      {...closedBy}
      {...backdrop}
      onKeyDown={event => { if (event.key === 'Escape' && sendingRef.current) askToWait(); }}
      onCancel={event => { if (sendingRef.current) { event.preventDefault(); askToWait(); } }}
      onClose={onClosed}
    >
      <div className="dlg-head">
        <h2 className="section-title" id="contact-title" tabIndex={-1}>Contact Gatherfund LLC</h2>
        <button type="button" className="icon-button" aria-label="Close" onClick={close}><CloseIcon /></button>
      </div>

      {sending && waitNote && (
        <div className="banner" id="send-wait">
          <strong>Still sending</strong>
          <span>This window stays open until we know whether your enquiry was sent. It takes a moment.</span>
        </div>
      )}

      {showForm && (
        <>
          <p className="secondary">Tell us what you have in mind and we’ll send it to the Gatherfund LLC team. All fields are required.</p>
          <form className={sending ? 'form locked' : 'form'} id="enquiry" noValidate aria-busy={sending} onSubmit={send}>
            <div className={fieldClass('name')}>
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" name="name" autoComplete="name" value={values.name} readOnly={sending} onChange={onField('name')} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} />
              {errors.name && <p className="field-error" id="f-name-error"><ErrorIcon /><span>Error: {errors.name}</span></p>}
            </div>
            <div className={fieldClass('email')}>
              <label htmlFor="f-email">Email address</label>
              <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="name@example.com" value={values.email} readOnly={sending} onChange={onField('email')} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} />
              {errors.email && <p className="field-error" id="f-email-error"><ErrorIcon /><span>Error: {errors.email}</span></p>}
            </div>
            <div className="field">
              <label htmlFor="f-topic">What would you like to talk about?</label>
              <select id="f-topic" name="topic" value={topic} disabled={sending} onChange={event => onTopicChange(event.target.value as Topic)}>
                {TOPICS.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className={fieldClass('message')}>
              <label htmlFor="f-message">Your message</label>
              <p className="supporting secondary" id="f-message-hint">A few sentences is enough, up to 5,000 characters.</p>
              <textarea id="f-message" name="message" rows={4} value={values.message} readOnly={sending} onChange={onField('message')} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy('message', 'f-message-hint')} />
              {errors.message && <p className="field-error" id="f-message-error"><ErrorIcon /><span>Error: {errors.message}</span></p>}
            </div>
            {/* Left empty by people, who never see it; bots that fill it are ignored by the server. */}
            <div className="visually-hidden" inert>
              <label htmlFor="f-website">Website</label>
              <input id="f-website" name="website" ref={honeypotRef} autoComplete="off" defaultValue="" />
            </div>
            <div className="consent">
              <p className="supporting secondary">We’ll use the details you enter to reply to your enquiry. Your message stays in this form if you open the privacy notice.</p>
              <Link
                className="text-link supporting"
                id="consent-privacy"
                href="/legal/privacy"
                aria-disabled={sending || undefined}
                onClick={event => {
                  if (sendingRef.current) { event.preventDefault(); askToWait(); return; }
                  dialogRef.current?.close();
                }}
              >
                Read the privacy notice
              </Link>
            </div>
            <div>
              <div className="send-alert" role="alert">
                {phase === 'failed' && (
                  <div className="banner danger" id="send-failed">
                    <strong>Not sent</strong>
                    <span>
                      {failure === 'rate'
                        ? `You’ve sent several enquiries in the last few minutes, so this one has not been sent. Your message is still here. Try again in 10 minutes, or copy your enquiry and email us at ${company.contactEmail}.`
                        : `We couldn’t send your enquiry, so the Gatherfund LLC team has not received it. Your message is still here. Try again, or copy your enquiry and email us at ${company.contactEmail}.`}
                    </span>
                  </div>
                )}
              </div>
              <div className="button-row">
                <button type="submit" className="button" id="send-enquiry" aria-disabled={sending || undefined}>
                  {sending ? 'Sending…' : phase === 'failed' ? 'Try again' : 'Send enquiry'}
                </button>
                <button type="button" className="button secondary-action" id="prepare-enquiry" aria-disabled={sending || undefined} onClick={prepare}>Copy enquiry instead</button>
              </div>
            </div>
          </form>
        </>
      )}

      <div role="status">
        {sending && <p className="visually-hidden">{waitNote ? 'Still sending. This window stays open until we know whether your enquiry was sent.' : 'Sending your enquiry.'}</p>}
        {phase === 'sent' && sent && (
          <div className="banner success" id="send-sent">
            <strong>Enquiry sent</strong>
            <span>The Gatherfund LLC team has your message and will reply to {sent.email} within {company.responseTime}. You don’t need to send it again.</span>
          </div>
        )}
        {phase === 'copy' && (
          <div className="banner">
            <strong>{status[0]}</strong>
            <span>{status[1]}</span>
          </div>
        )}
      </div>

      {phase === 'sent' && sent && (
        <div className="form" id="enquiry-sent">
          <div className="dlg-detail">
            <strong>What you sent</strong>
            <p className="supporting sent-copy">Topic: {sent.topic}</p>
            <p className="supporting sent-copy">{sent.message}</p>
          </div>
          <p className="supporting secondary">If you haven’t heard from us after {company.responseTime}, email {company.contactEmail}.</p>
          <div className="button-row">
            <button type="button" className="button" id="sent-done" onClick={close}>Done</button>
            <button
              type="button"
              className="button secondary-action"
              id="send-another"
              onClick={() => {
                setPhase('form');
                setSent(null);
                setValues(current => ({ ...current, message: '' }));
                focusLater('#f-message');
              }}
            >
              Send another enquiry
            </button>
          </div>
        </div>
      )}

      {phase === 'copy' && (
        <div className="form" id="enquiry-result">
          <div className="field">
            <label htmlFor="enquiry-text">Your enquiry</label>
            <textarea id="enquiry-text" ref={enquiryRef} rows={8} readOnly value={enquiry} />
          </div>
          <div className="button-row">
            <button type="button" className="button" id="copy-enquiry" onClick={copy}>Copy enquiry</button>
            <button
              type="button"
              className="button secondary-action"
              id="edit-enquiry"
              onClick={() => {
                setCopied(null);
                setPhase('form');
                focusLater('#f-name');
              }}
            >
              Edit details
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

function VentureDialog({ dialogRef, onAsk }: { dialogRef: RefObject<HTMLDialogElement | null>; onAsk: () => void }) {
  const backdrop = useBackdropClose(() => dialogRef.current?.close());
  return (
    <dialog
      className="dlg"
      id="venture-dialog"
      ref={dialogRef}
      aria-labelledby="venture-dialog-title"
      {...backdrop}
    >
      <div className="dlg-head">
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand artwork */}
        <img className="dlg-logo" src="/assets/gatherfund-logo.svg" alt="Gatherfund" width={160} height={37} />
        <button type="button" className="icon-button" aria-label="Close" onClick={() => dialogRef.current?.close()}><CloseIcon /></button>
      </div>
      <h2 className="section-title" id="venture-dialog-title" tabIndex={-1}>Support that brings us together.</h2>
      <p className="secondary">Gatherfund is the fundraising venture in the Gatherfund LLC family. It explores community causes, fundraiser discovery, and giving for Ghana and the diaspora.</p>
      <div className="dlg-detail">
        <strong>A people-first platform</strong>
        <p className="supporting">Explore causes, share a fundraising story, and bring supporters around what matters to a community.</p>
      </div>
      <p className="supporting secondary">Gatherfund is in development and is not open to the public yet.</p>
      <div className="button-row">
        <button type="button" className="button" id="venture-connect" onClick={onAsk}>Ask about Gatherfund</button>
      </div>
    </dialog>
  );
}

export function ContactTrigger({ className, id, topic, children }: { className: string; id?: string; topic?: Topic; children: ReactNode }) {
  const { openContact } = useDialogs();
  return <button type="button" className={className} id={id} onClick={() => openContact(topic)}>{children}</button>;
}

export function VentureTrigger({ className, id, children }: { className: string; id?: string; children: ReactNode }) {
  const { openVenture } = useDialogs();
  return <button type="button" className={className} id={id} onClick={openVenture}>{children}</button>;
}
