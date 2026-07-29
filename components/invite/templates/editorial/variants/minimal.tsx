"use client";

import { PageWrapper, ScrollIndicator } from "../../../core";
import {
  HeroSection,
  StorySection,
  CountdownSection,
  VenueSection,
  TimelineSection,
  QuoteSection,
  DetailsSection,
  RSVPSection,
  FooterSection,
  StickyRsvpCta,
} from "../../../sections";
import type { TemplateProps } from "../../../types";

/** Minimal: typography-first. Skip gallery/image blocks. Large spacing. Stationery feel. */
export function MinimalLayout({ invitation, rsvp }: Omit<TemplateProps, "variantId">) {
  return (
    <PageWrapper>
      <ScrollIndicator />
      <HeroSection invitation={invitation} layout="minimal" />
      <QuoteSection invitation={invitation} />
      <StorySection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <VenueSection invitation={invitation} />
      <TimelineSection invitation={invitation} />
      <DetailsSection invitation={invitation} />
      {invitation.rsvpEnabled && (
        <RSVPSection rsvp={rsvp} invitation={invitation} />
      )}
      <FooterSection invitation={invitation} />
      {invitation.rsvpEnabled ? <StickyRsvpCta /> : null}
    </PageWrapper>
  );
}
