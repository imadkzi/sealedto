"use client";

import {
  AnimatedReveal,
  ParallaxContainer,
  ScrollCue,
  SplitText,
} from "../core";
import type { Invitation } from "../types";
import {
  introUsesClassicEyebrow,
  sanitizeIntroHtml,
} from "@/lib/introHtml";
import { MediaPlaceholder } from "./MediaPlaceholder";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
  layout?: "default" | "split" | "minimal" | "fullscreen" | "cover";
}

export function HeroSection({ invitation, layout = "default" }: Props) {
  const { bride, groom, coupleDisplayName, weddingDate, venue, guestName } =
    invitation;

  const dateStr = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(weddingDate);

  const heroClass =
    layout === "split"
      ? styles.heroSplit
      : layout === "minimal"
        ? styles.heroMinimal
        : layout === "fullscreen"
          ? styles.heroFullscreen
          : layout === "cover"
            ? styles.heroCover
            : styles.hero;

  const hasImage = Boolean(invitation.heroImage);
  const bleedImage = layout === "fullscreen" || layout === "cover";
  const showImage = layout !== "minimal" && hasImage && !bleedImage;
  const showPlaceholder =
    layout !== "minimal" && !hasImage && (layout === "split" || bleedImage);

  const introLine = invitation.introLine || "Together with their families";
  const introHtml = sanitizeIntroHtml(introLine);
  const introClassic = introUsesClassicEyebrow(introHtml);
  const eventLine =
    invitation.eventLine ||
    (invitation.mode === "save_the_date"
      ? "to save the date for"
      : "the wedding of");

  return (
    <section className={heroClass}>
      {bleedImage && hasImage && (
        <>
          <div
            className={
              layout === "cover" ? styles.heroCoverBg : styles.heroFullscreenBg
            }
          >
            <img
              src={invitation.heroImage}
              alt={`${bride.name} & ${groom.name}`}
            />
          </div>
          <div
            className={
              layout === "cover"
                ? styles.heroCoverScrim
                : styles.heroFullscreenOverlay
            }
          />
        </>
      )}
      {bleedImage && showPlaceholder ? (
        <MediaPlaceholder fullscreen label="Add a hero photo" />
      ) : null}

      <div className={styles.heroText}>
        <div className={styles.heroLead}>
          <AnimatedReveal variant="mask">
            <div
              className={introClassic ? styles.heroEyebrow : styles.heroIntro}
              dangerouslySetInnerHTML={{ __html: introHtml }}
            />
          </AnimatedReveal>
          {guestName ? (
            <AnimatedReveal variant="mask" delay={0.08}>
              <p className={styles.heroGreeting}>
                {guestName}, you are invited to
              </p>
            </AnimatedReveal>
          ) : null}
          <AnimatedReveal variant="mask" delay={guestName ? 0.12 : 0.08}>
            <p className={styles.heroEvent}>{eventLine}</p>
          </AnimatedReveal>
        </div>
        <h1 className={styles.heroNames}>
          <SplitText
            text={coupleDisplayName ?? `${bride.name} & ${groom.name}`}
            by="char"
            delay={0.15}
          />
        </h1>
        <AnimatedReveal variant="drift" delay={0.3}>
          <div className={styles.heroDetails}>
            <p>{dateStr}</p>
            <p>{venue.name}</p>
          </div>
        </AnimatedReveal>
      </div>

      {showImage && (
        <ParallaxContainer className={styles.heroImageWrap} speed={0.12}>
          <img
            src={invitation.heroImage}
            alt={`${bride.name} & ${groom.name}`}
            className={styles.heroImage}
          />
        </ParallaxContainer>
      )}

      {showPlaceholder && layout === "split" ? (
        <div className={styles.heroImageWrap}>
          <MediaPlaceholder label="Add a hero photo" />
        </div>
      ) : null}

      <div className={styles.heroCue}>
        <ScrollCue />
      </div>
    </section>
  );
}
