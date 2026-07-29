"use client";

import { useEffect, useState } from "react";
import styles from "./sections.module.scss";

export function StickyRsvpCta() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById("rsvp");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <a className={styles.stickyRsvp} href="#rsvp">
      RSVP
    </a>
  );
}
