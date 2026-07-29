"use client";

import { PageWrapper, ScrollIndicator } from "../../../core";
import {
  HeroSection,
  GallerySection,
  CountdownSection,
  VenueSection,
  QuoteSection,
  DetailsSection,
  RSVPSection,
  FooterSection,
  StickyRsvpCta,
} from "../../../sections";
import type { TemplateProps } from "../../../types";

/** Gallery: photography-driven. Large immersive images. Minimal typography. */
export function GalleryLayout({ invitation, rsvp }: Omit<TemplateProps, "variantId">) {
  return (
    <PageWrapper>
      <ScrollIndicator />
      <HeroSection invitation={invitation} />
      <GallerySection invitation={invitation} layout="immersive" />
      <QuoteSection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <VenueSection invitation={invitation} />
      <DetailsSection invitation={invitation} />
      {invitation.rsvpEnabled && (
        <RSVPSection rsvp={rsvp} invitation={invitation} />
      )}
      <FooterSection invitation={invitation} />
      {invitation.rsvpEnabled ? <StickyRsvpCta /> : null}
    </PageWrapper>
  );
}
