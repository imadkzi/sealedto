"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import styles from "./IntroOverlay.module.scss";

interface Props {
  partnerOne: string;
  partnerTwo: string;
  guestName?: string;
  introLine?: string;
  eventLine?: string;
  onComplete: () => void;
}

export function IntroOverlay({
  partnerOne,
  partnerTwo,
  guestName,
  introLine = "Together with their families",
  eventLine = "the wedding of",
  onComplete,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const initialsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const eventRef = useRef<HTMLParagraphElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const completedRef = useRef(false);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mounted) return;
    if (reduced) {
      finish();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const fadeEls = [
      initialsRef.current,
      lineRef.current,
      line1Ref.current,
      greetingRef.current,
      eventRef.current,
      namesRef.current,
    ].filter(Boolean);

    gsap.set(root, { opacity: 1 });
    gsap.set(fadeEls, { opacity: 0, y: 12 });
    gsap.set(lineRef.current, { scaleX: 0, y: 0 });

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

    tl.to(initialsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    })
      .to(
        lineRef.current,
        { opacity: 1, scaleX: 1, duration: 0.5, ease: "power2.out" },
        "+=0.1",
      )
      .to(
        line1Ref.current,
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "+=0.15",
      );

    if (greetingRef.current) {
      tl.to(
        greetingRef.current,
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "+=0.1",
      );
    }

    tl.to(
      eventRef.current,
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "+=0.1",
    )
      .to(
        namesRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "+=0.1",
      )
      .to({}, { duration: 0.4 });

    return () => {
      tl.kill();
    };
  }, [mounted, reduced, onComplete]);

  const initials =
    `${partnerOne.charAt(0)}${partnerTwo.charAt(0)}`.toUpperCase();

  if (!mounted || reduced) return null;

  return (
    <div ref={rootRef} className={styles.overlay} style={{ opacity: 0 }}>
      <div className={styles.content}>
        <div ref={initialsRef} className={styles.initials}>
          {initials}
        </div>
        <div ref={lineRef} className={styles.line} />
        <p ref={line1Ref} className={styles.copy}>
          {introLine}
        </p>
        {guestName ? (
          <p ref={greetingRef} className={styles.greeting}>
            {guestName}, you are invited to
          </p>
        ) : null}
        <p ref={eventRef} className={styles.copy}>
          {eventLine}
        </p>
        <h2 ref={namesRef} className={styles.names}>
          {partnerOne} & {partnerTwo}
        </h2>
      </div>
      <button type="button" className={styles.skip} onClick={finish}>
        Skip
      </button>
    </div>
  );
}
