'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { FormEvent, MouseEvent, ReactNode, RefObject } from 'react';

const TOPICS = ['Partnership opportunities', 'A new venture idea', 'Gatherfund', 'A general enquiry'] as const;
type Topic = (typeof TOPICS)[number];

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

// Closes a native <dialog> when its backdrop (the area outside the box) is clicked.
function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
  const dialog = event.currentTarget;
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const contactRef = useRef<HTMLDialogElement>(null);
  const ventureRef = useRef<HTMLDialogElement>(null);
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);

  const openContact = useCallback((nextTopic?: Topic) => {
    if (nextTopic) setTopic(nextTopic);
    contactRef.current?.showModal();
  }, []);
  const openVenture = useCallback(() => ventureRef.current?.showModal(), []);
  const controls = useMemo(() => ({ openContact, openVenture }), [openContact, openVenture]);

  return (
    <DialogContext.Provider value={controls}>
      {children}
      <ContactDialog dialogRef={contactRef} topic={topic} onTopicChange={setTopic} />
      <VentureDialog
        dialogRef={ventureRef}
        onConnect={() => {
          ventureRef.current?.close();
          openContact('Gatherfund');
        }}
      />
    </DialogContext.Provider>
  );
}

function ContactDialog({ dialogRef, topic, onTopicChange }: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  topic: Topic;
  onTopicChange: (topic: Topic) => void;
}) {
  const [enquiry, setEnquiry] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const enquiryRef = useRef<HTMLTextAreaElement>(null);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setEnquiry(`Gatherfund LLC enquiry\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nInterest: ${topic}\n\n${data.get('message')}`);
    setStatus('Your enquiry is ready to copy. No message has been sent.');
  }

  async function copy() {
    if (enquiry === null) return;
    try {
      await navigator.clipboard.writeText(enquiry);
      setStatus('Copied. You can paste your enquiry into a message to the Gather team.');
    } catch {
      enquiryRef.current?.focus();
      enquiryRef.current?.select();
      setStatus('Select and copy the enquiry above using your device’s copy command.');
    }
  }

  return (
    <dialog id="contact-dialog" ref={dialogRef} onClick={closeOnBackdrop}>
      <button className="close" aria-label="Close dialog" onClick={() => dialogRef.current?.close()}>×</button>
      <div className="eyebrow">LET’S CONNECT</div>
      <h2>A good place<br />to begin.</h2>
      <p>Prepare a partnership enquiry to share with the Gather team. This design preview does not send messages.</p>
      {/* The form stays mounted (only hidden) so "Edit details" returns with the visitor's input intact. */}
      <form id="enquiry" onSubmit={prepare} style={enquiry === null ? undefined : { display: 'none' }}>
        <label>Your name<input name="name" required autoComplete="name" placeholder="Full name" /></label>
        <label>Email address<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label>
          What would you like to explore?
          <select name="topic" value={topic} onChange={event => onTopicChange(event.target.value as Topic)}>
            {TOPICS.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>Your idea<textarea name="message" required rows={3} placeholder="Tell us a little about what you have in mind…" /></label>
        <button className="button" type="submit">Prepare enquiry <span aria-hidden="true">→</span></button>
      </form>
      {enquiry !== null && (
        <div id="enquiry-result">
          <label>Your enquiry<textarea id="enquiry-text" ref={enquiryRef} rows={8} readOnly value={enquiry} /></label>
          <button className="button" id="copy-enquiry" autoFocus onClick={copy}>Copy enquiry</button>
          <p id="copy-status" role="status">{status}</p>
          <button
            className="text-link"
            id="edit-enquiry"
            onClick={() => {
              setEnquiry(null);
              requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLInputElement>('#enquiry input')?.focus());
            }}
          >
            Edit details
          </button>
        </div>
      )}
    </dialog>
  );
}

function VentureDialog({ dialogRef, onConnect }: { dialogRef: RefObject<HTMLDialogElement | null>; onConnect: () => void }) {
  return (
    <dialog id="venture-dialog" ref={dialogRef} onClick={closeOnBackdrop}>
      <button className="close" aria-label="Close dialog" onClick={() => dialogRef.current?.close()}>×</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="dialog-logo" src="/assets/gatherfund-logo.svg" alt="Gatherfund" />
      <h2>Support that<br />brings us together.</h2>
      <p>Gatherfund is the fundraising venture in the Gather family. The supplied prototype explores community causes, fundraiser discovery, and giving for Ghana and the diaspora.</p>
      <div className="dialog-detail">
        <strong>A people-first platform</strong>
        <p>Explore causes, share a fundraising story, and bring supporters around what matters to a community.</p>
      </div>
      <p className="muted">The prototype is a design demonstration. A live Gatherfund destination has not been linked in this preview.</p>
      <button className="button" id="venture-connect" onClick={onConnect}>Ask about Gatherfund <span aria-hidden="true">↗</span></button>
    </dialog>
  );
}

export function ContactTrigger({ className, children }: { className: string; children: ReactNode }) {
  const { openContact } = useDialogs();
  return <button className={className} onClick={() => openContact()}>{children}</button>;
}

export function VentureTrigger({ className, children }: { className: string; children: ReactNode }) {
  const { openVenture } = useDialogs();
  return <button className={className} onClick={openVenture}>{children}</button>;
}
