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

/** Split: image left, content right. Alternating magazine composition. */
export function SplitLayout({ invitation, rsvp }: Omit<TemplateProps, "variantId">) {
  return (
    <PageWrapper>
      <ScrollIndicator />
      <HeroSection invitation={invitation} layout="split" />
      <StorySection invitation={invitation} layout="split" />
      <CountdownSection invitation={invitation} />
      <VenueSection invitation={invitation} />
      <TimelineSection invitation={invitation} />
      <GallerySection invitation={invitation} layout="split" />
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
