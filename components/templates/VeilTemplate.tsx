"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  InviteLetter,
  type InviteLetterProps,
} from "@/components/templates/InviteLetter";
import styles from "@/styles/pages/Invite.module.scss";

type Props = Omit<InviteLetterProps, "className"> & {
  accent: string;
};

export function VeilTemplate(props: Props) {
  const { accent, invite, ...letterProps } = props;
  const [opened, setOpened] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const opening = useRef(false);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (opened) return;

    if (reducedMotion) {
      gsap.set(rootRef.current, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    gsap.set(
      [subtitleRef.current, namesRef.current, ruleRef.current, ctaRef.current],
      { opacity: 0, y: 14 },
    );
    gsap.set(rootRef.current, { opacity: 1 });

    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.05)
      .to(namesRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.18)
      .to(ruleRef.current, { opacity: 1, y: 0, duration: 0.45 }, 0.4)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.45 }, 0.55);
  }, [opened, reducedMotion]);

  function open() {
    if (opened || opening.current) return;
    opening.current = true;

    if (reducedMotion) {
      gsap.to(veilRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => setOpened(true),
      });
      gsap.to(ctaRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(letterRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.3,
        delay: 0.05,
      });
      return;
    }

    rootRef.current?.classList.add(styles.veilBright);

    const tl = gsap.timeline({
      onComplete: () => setOpened(true),
    });

    tl.to(
      namesRef.current,
      { y: -14, opacity: 0, duration: 0.32, ease: "power2.out" },
      0,
    )
      .to(
        [subtitleRef.current, ruleRef.current, ctaRef.current],
        { opacity: 0, duration: 0.28, ease: "power2.out" },
        0.05,
      )
      .to(
        veilRef.current,
        {
          yPercent: -110,
          filter: "blur(8px)",
          opacity: 0.2,
          duration: 1.15,
          ease: "power3.out",
        },
        0.22,
      )
      .fromTo(
        letterRef.current,
        { opacity: 0, y: 28, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
        },
        0.55,
      );
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.templateRoot} ${styles.veilRoot} ${opened ? styles.templateOpened : ""}`}
      style={
        {
          "--invite-accent": accent,
          opacity: opened ? 1 : 0,
        } as React.CSSProperties
      }
    >
      <div className={styles.splashStage}>
        <div className={styles.veilBackdrop} aria-hidden>
          <div className={styles.veilGrain} />
        </div>
        <div className={styles.veilGlow} aria-hidden />

        {!opened ? (
          <div ref={veilRef} className={styles.veilSheet}>
            <p ref={subtitleRef} className={styles.veilSubtitle}>
              An invitation
            </p>
            <h1 ref={namesRef} className={styles.veilNames}>
              {invite.partner_one}
              <span className={styles.veilAmp}>&</span>
              {invite.partner_two}
            </h1>
            <div ref={ruleRef} className={styles.goldRule} aria-hidden />
          </div>
        ) : null}

        {!opened ? (
          <button
            ref={ctaRef}
            type="button"
            className={styles.veilCta}
            onClick={open}
          >
            Open
          </button>
        ) : null}

        <div
          ref={letterRef}
          className={`${styles.letterReveal} ${opened ? styles.letterRevealIn : ""}`}
          aria-hidden={!opened}
          inert={!opened ? true : undefined}
        >
          <InviteLetter
            invite={invite}
            {...letterProps}
            className={styles.letterVeil}
          />
        </div>
      </div>
    </div>
  );
}
