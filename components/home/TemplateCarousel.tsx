"use client";

import { useState, type CSSProperties } from "react";
import styles from "@/styles/pages/Home.module.scss";

const TEMPLATES = [
  {
    id: "sana",
    names: "Sana & Hamza",
    theme: "Noir Floral",
    tone: "dark",
  },
  {
    id: "fatima",
    names: "Fatima & Yusuf",
    theme: "Ivory Bloom",
    tone: "light",
  },
  {
    id: "maryam",
    names: "Maryam & Ibrahim",
    theme: "Damask Seal",
    tone: "rich",
  },
  {
    id: "aaliyah",
    names: "Aaliyah & Rayan",
    theme: "Soft Botanical",
    tone: "soft",
  },
] as const;

const TONE_CLASS = {
  dark: styles.tone_dark,
  light: styles.tone_light,
  rich: styles.tone_rich,
  soft: styles.tone_soft,
} as const;

export function TemplateCarousel() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((value) => (value === 0 ? TEMPLATES.length - 1 : value - 1));
  }

  function next() {
    setIndex((value) => (value + 1) % TEMPLATES.length);
  }

  return (
    <div className={styles.carousel}>
      <button
        type="button"
        className={styles.carouselArrow}
        onClick={prev}
        aria-label="Previous templates"
      >
        ←
      </button>

      <div
        className={styles.carouselTrack}
        style={{ "--i": index } as CSSProperties}
      >
        {TEMPLATES.map((template) => (
          <article
            key={template.id}
            className={`${styles.templateCard} ${TONE_CLASS[template.tone]}`}
          >
            <p className={styles.templateEyebrow}>Together with their families</p>
            <h3 className={styles.templateNames}>{template.names}</h3>
            <p className={styles.templateMeta}>{template.theme}</p>
            <span className={styles.templateCta}>RSVP</span>
          </article>
        ))}
      </div>

      <button
        type="button"
        className={styles.carouselArrow}
        onClick={next}
        aria-label="Next templates"
      >
        →
      </button>

      <div className={styles.carouselDots}>
        {TEMPLATES.map((template, i) => (
          <button
            key={template.id}
            type="button"
            className={i === index ? styles.dotActive : styles.dot}
            onClick={() => setIndex(i)}
            aria-label={`Show ${template.names}`}
          />
        ))}
      </div>
    </div>
  );
}
