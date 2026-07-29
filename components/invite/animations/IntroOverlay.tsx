"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import styles from "./IntroOverlay.module.scss";

interface Props {
  partnerOne: string;
  partnerTwo: string;
  guestName?: string;
  introLine?: string;
  onComplete: () => void;
}

export function IntroOverlay({
  partnerOne,
  partnerTwo,
  guestName,
  introLine = "Together with their families",
  onComplete,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const initialsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const completedRef = useRef(false);
  const reduced = useReducedMotion();

  function finish() {
    if (completedRef.current) return;
    completedRef.current = true;
    const root = rootRef.current;
    timelineRef.current?.kill();
    if (!root) {
      onComplete();
      return;
    }
    gsap.to(root, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: () => {
        root.style.display = "none";
        onComplete();
      },
    });
  }

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      gsap.set(root, { opacity: 1 });
      gsap.to(root, {
        opacity: 0,
        duration: 0.4,
        delay: 0.3,
        onComplete: () => {
          if (completedRef.current) return;
          completedRef.current = true;
          root.style.display = "none";
          onComplete();
        },
      });
      return;
    }

    const els = {
      initials: initialsRef.current,
      line: lineRef.current,
      line1: line1Ref.current,
      names: namesRef.current,
      line2: line2Ref.current,
    };

    gsap.set(root, { opacity: 1 });
    gsap.set([els.initials, els.line, els.line1, els.names, els.line2], {
      opacity: 0,
      y: 12,
    });
    gsap.set(els.line, { scaleX: 0, y: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        if (completedRef.current) return;
        completedRef.current = true;
        gsap.to(root, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            root.style.display = "none";
            onComplete();
          },
        });
      },
    });
    timelineRef.current = tl;

    tl.to(els.initials, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
      .to(els.line, { opacity: 1, scaleX: 1, duration: 0.5, ease: "power2.out" }, "+=0.1")
      .to(els.line1, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "+=0.15")
      .to(els.names, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "+=0.1")
      .to(els.line2, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "+=0.1")
      .to({}, { duration: 0.4 });

    return () => {
      tl.kill();
    };
  }, [reduced, onComplete]);

  const initials = `${partnerOne.charAt(0)}${partnerTwo.charAt(0)}`.toUpperCase();

  return (
    <div ref={rootRef} className={styles.overlay} style={{ opacity: 0 }}>
      <div className={styles.content}>
        <div ref={initialsRef} className={styles.initials}>
          {initials}
        </div>
        <div ref={lineRef} className={styles.line} />
        <p ref={line1Ref} className={styles.copy}>
          {guestName ? `${guestName}, you are invited` : introLine}
        </p>
        <h2 ref={namesRef} className={styles.names}>
          {partnerOne} & {partnerTwo}
        </h2>
        <p ref={line2Ref} className={styles.copy}>
          {guestName ? "To celebrate their wedding" : "Invite you to celebrate"}
        </p>
      </div>
      <button type="button" className={styles.skip} onClick={finish}>
        Skip
      </button>
    </div>
  );
}
