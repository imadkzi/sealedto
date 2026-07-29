"use client";

import { PageWrapper, ScrollIndicator } from "../../../core";
import {
  HeroSection,
  StorySection,
  CountdownSection,
  VenueSection,
  TimelineSection,
  GallerySection,
  QuoteSection,
  DetailsSection,
  RSVPSection,
  FooterSection,
  StickyRsvpCta,
} from "../../../sections";
import type { TemplateProps } from "../../../types";

/** Fullscreen: each section near-viewport. Immersive scrolling. Large photography. */
export function FullscreenLayout({ invitation, rsvp }: Omit<TemplateProps, "variantId">) {
  return (
    <PageWrapper>
      <ScrollIndicator />
      <HeroSection invitation={invitation} layout="fullscreen" />
      <StorySection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <VenueSection invitation={invitation} />
      <TimelineSection invitation={invitation} />
      <GallerySection invitation={invitation} layout="immersive" />
      <DetailsSection invitation={invitation} />
      <QuoteSection invitation={invitation} />
      {invitation.rsvpEnabled && (
        <RSVPSection rsvp={rsvp} invitation={invitation} />
      )}
      <FooterSection invitation={invitation} />
      {invitation.rsvpEnabled ? <StickyRsvpCta /> : null}
    </PageWrapper>
  );
}
