"use client";

import { AnimatedReveal, ParallaxContainer, ScrollCue, SplitText } from "../core";
import type { Invitation } from "../types";
import { MediaPlaceholder } from "./MediaPlaceholder";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
  layout?: "default" | "split" | "minimal" | "fullscreen";
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
          : styles.hero;

  const hasImage = Boolean(invitation.heroImage);
  const showImage = layout !== "minimal" && hasImage;
  const showPlaceholder =
    layout !== "minimal" &&
    !hasImage &&
    (layout === "split" || layout === "fullscreen");

  const eyebrow = guestName
    ? `${guestName}, you are invited`
    : invitation.introLine || "Together with their families";

  return (
    <section className={heroClass}>
      {layout === "fullscreen" && hasImage && (
        <>
          <div className={styles.heroFullscreenBg}>
            <img
              src={invitation.heroImage}
              alt={`${bride.name} & ${groom.name}`}
            />
          </div>
          <div className={styles.heroFullscreenOverlay} />
        </>
      )}
      {layout === "fullscreen" && showPlaceholder ? (
        <MediaPlaceholder fullscreen label="Add a hero photo" />
      ) : null}

      <div className={styles.heroText}>
        <AnimatedReveal variant="mask">
          <p className={guestName ? styles.heroGreeting : styles.heroEyebrow}>
            {eyebrow}
          </p>
        </AnimatedReveal>
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

      {showImage && layout !== "fullscreen" && (
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
