"use client";

import { MapPin, Navigation } from "lucide-react";
import { SectionSpacing, SectionTitle, AnimatedReveal, Divider } from "../core";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
}

export function VenueSection({ invitation }: Props) {
  const { venue } = invitation;
  const destination = [venue.name, venue.address].filter(Boolean).join(", ");
  const query = encodeURIComponent(destination);
  const mapLinks = [
    {
      label: "Google Maps",
      href: `https://www.google.com/maps/search/?api=1&query=${query}`,
    },
    {
      label: "Apple Maps",
      href: `https://maps.apple.com/?q=${query}`,
    },
    {
      label: "Waze",
      href: `https://www.waze.com/ul?q=${query}&navigate=yes`,
    },
  ];
  const staticMapUrl = venue.coordinates
    ? `https://staticmap.openstreetmap.de/staticmap.php?center=${venue.coordinates.lat},${venue.coordinates.lng}&zoom=14&size=800x360&maptype=mapnik&markers=${venue.coordinates.lat},${venue.coordinates.lng},red-pushpin`
    : null;

  return (
    <SectionSpacing id="venue">
      <div className={styles.venue}>
        <SectionTitle>The Venue</SectionTitle>
        <Divider variant="ornament" />
        <AnimatedReveal delay={0.1}>
          <h3 className={styles.venueName}>{venue.name}</h3>
        </AnimatedReveal>
        {venue.address && (
          <AnimatedReveal delay={0.2}>
            <p className={styles.venueAddress}>{venue.address}</p>
          </AnimatedReveal>
        )}
        {staticMapUrl ? (
          <AnimatedReveal delay={0.25}>
            <a
              href={mapLinks[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.venueMapThumbnail}
              aria-label="Open venue in Google Maps"
            >
              <img
                src={staticMapUrl}
                alt={`Map showing ${venue.name}`}
                loading="lazy"
              />
            </a>
          </AnimatedReveal>
        ) : null}
        <AnimatedReveal delay={0.3}>
          <div className={styles.venueMapActions} aria-label="Open venue in maps">
            {mapLinks.map((map) => (
              <a
                key={map.label}
                href={map.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.venueMapButton}
              >
                {map.label === "Google Maps" ? (
                  <MapPin size={14} />
                ) : (
                  <Navigation size={14} />
                )}
                {map.label}
              </a>
            ))}
          </div>
        </AnimatedReveal>
      </div>
    </SectionSpacing>
  );
}
