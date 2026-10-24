'use client';

/* eslint-disable @next/next/no-img-element -- the slides cross-fade in a fixed frame; next/image adds nothing here */
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const SLIDES = [
  { src: '/assets/funeral.jpg', width: 1536, height: 1024, position: '50% 50%', caption: 'In hard times, no family stands alone.', alt: 'Mourners in black and red funeral cloth sit together at a Ghanaian funeral as one woman comforts another' },
  { src: '/assets/schoolgirl.jpg', width: 1536, height: 1024, position: '40% 40%', caption: 'Every child deserves a seat in class.', alt: 'A schoolgirl in a yellow and brown uniform looks up from her exercise book in a Ghanaian classroom' },
  { src: '/assets/water.jpg', width: 1100, height: 1650, position: '50% 35%', caption: 'Clean water, closer to home.', alt: 'A young man draws water by rope from a concrete well' },
];

// Photos change only when the visitor asks; nothing moves on its own.
export function VentureCarousel() {
  const [slide, setSlide] = useState(0);
  const current = ((slide % SLIDES.length) + SLIDES.length) % SLIDES.length;

  return (
    <div className="venture-image" role="region" aria-roledescription="carousel" aria-label="Causes people gather for">
      {SLIDES.map((item, index) => (
        <img
          key={item.src}
          className="slide"
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: item.position }}
          aria-hidden={index !== current}
          data-current={index === current ? '' : undefined}
        />
      ))}
      <div className="image-note supporting">
        <p aria-live="polite"><span className="visually-hidden">Photo {current + 1} of {SLIDES.length}: </span>{SLIDES[current]!.caption}</p>
        <div className="slide-controls">
          <button type="button" className="slide-button" aria-label="Previous photo" onClick={() => setSlide(value => value - 1)}><ChevronLeftIcon /></button>
          <span className="slide-count micro secondary tnum" aria-hidden="true">{current + 1} / {SLIDES.length}</span>
          <button type="button" className="slide-button" aria-label="Next photo" onClick={() => setSlide(value => value + 1)}><ChevronRightIcon /></button>
        </div>
      </div>
    </div>
  );
}
