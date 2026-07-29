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

/** Classic: centred hero, optional hero image, elegant whitespace, luxury magazine. */
export function ClassicLayout({ invitation, rsvp }: Omit<TemplateProps, "variantId">) {
  return (
    <PageWrapper>
      <ScrollIndicator />
      <HeroSection invitation={invitation} />
      <StorySection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <VenueSection invitation={invitation} />
      <TimelineSection invitation={invitation} />
      <GallerySection invitation={invitation} />
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
