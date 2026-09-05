"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { SectionSpacing, SectionTitle, AnimatedReveal, Divider } from "../core";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

function osmEmbedUrl(lat: number, lng: number) {
  const pad = 0.012;
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

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
  const [mapReady, setMapReady] = useState(false);
  const mapEmbedUrl = venue.coordinates
    ? osmEmbedUrl(venue.coordinates.lat, venue.coordinates.lng)
    : null;

  useEffect(() => {
    setMapReady(true);
  }, []);

  return (
    <SectionSpacing id="venue">
      <div className={styles.venue}>
        <SectionTitle>The Venue</SectionTitle>
        <Divider variant="ornament" />
        <AnimatedReveal variant="mask" delay={0.1}>
          <h3 className={styles.venueName}>{venue.name}</h3>
        </AnimatedReveal>
        {venue.address && (
          <AnimatedReveal variant="mask" delay={0.2}>
            <p className={styles.venueAddress}>{venue.address}</p>
          </AnimatedReveal>
        )}
        {mapEmbedUrl ? (
          <AnimatedReveal variant="scale" delay={0.25}>
            <div className={styles.venueMapThumbnail}>
              {mapReady ? (
                <iframe
                  title={`Map showing ${venue.name}`}
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : null}
            </div>
          </AnimatedReveal>
        ) : null}
        <AnimatedReveal variant="tilt" delay={0.3}>
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
