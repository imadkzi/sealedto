"use client";

import { SectionSpacing, SectionTitle, AnimatedReveal, Divider } from "../core";
import type { Invitation, RsvpSlot } from "../types";
import styles from "./sections.module.scss";

interface Props {
  rsvp: RsvpSlot;
  invitation?: Invitation;
}

export function RSVPSection({ rsvp, invitation }: Props) {
  const title =
    rsvp.isCurated && rsvp.guestName
      ? `${rsvp.guestName}, please RSVP`
      : "RSVP";

  const deadline = invitation?.rsvpDeadline
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(
        invitation.rsvpDeadline instanceof Date
          ? invitation.rsvpDeadline
          : new Date(invitation.rsvpDeadline),
      )
    : null;

  return (
    <SectionSpacing id="rsvp" tone="stone">
      <div className={styles.rsvpCard}>
        <SectionTitle>{title}</SectionTitle>
        <Divider variant="diamond" />
        {deadline ? (
          <p className={styles.rsvpDeadline}>Kindly reply by {deadline}</p>
        ) : null}

        {rsvp.done ? (
          <AnimatedReveal variant="tilt">
            <div className={styles.rsvpThanks}>
              {rsvp.isCurated && rsvp.guestName
                ? `Thank you, ${rsvp.guestName} — your RSVP is sealed.`
                : "Thank you — your RSVP is sealed."}
            </div>
          </AnimatedReveal>
        ) : (
          <AnimatedReveal variant="rise">
            <form className={styles.rsvpForm} onSubmit={rsvp.onSubmit}>
              {rsvp.mode === "public" && (
                <label className={styles.rsvpLabel}>
                  Your name
                  <input
                    className={styles.rsvpInput}
                    required
                    value={rsvp.name}
                    onChange={(e) => rsvp.setName(e.target.value)}
                    placeholder="Full name"
                  />
                </label>
              )}

              <div className={styles.rsvpStatuses} role="group" aria-label="RSVP">
                {(["yes", "maybe", "no"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`${styles.rsvpStatus} ${rsvp.status === v ? styles.rsvpStatusActive : ""}`}
                    onClick={() => rsvp.setStatus(v)}
                  >
                    {v === "yes" ? "Yes" : v === "maybe" ? "Maybe" : "No"}
                  </button>
                ))}
              </div>

              {rsvp.isCurated ? (
                <p className={styles.rsvpLocked}>
                  Party size{" "}
                  <strong>
                    {rsvp.partySize}{" "}
                    {rsvp.partySize === 1 ? "guest" : "guests"}
                  </strong>
                </p>
              ) : (
                <label className={styles.rsvpLabel}>
                  Party size
                  <input
                    className={styles.rsvpInput}
                    type="number"
                    min={1}
                    max={20}
                    value={rsvp.partySize}
                    onChange={(e) =>
                      rsvp.setPartySize(Number(e.target.value) || 1)
                    }
                  />
                </label>
              )}

              <label className={styles.rsvpLabel}>
                Note (optional)
                <input
                  className={styles.rsvpInput}
                  value={rsvp.note}
                  onChange={(e) => rsvp.setNote(e.target.value)}
                  placeholder="Dietary needs, song requests…"
                />
              </label>

              {rsvp.error && (
                <p style={{ color: "#c44", fontSize: "0.85rem" }}>{rsvp.error}</p>
              )}

              <button
                className={styles.rsvpSubmit}
                type="submit"
                disabled={rsvp.submitting}
              >
                {rsvp.submitting ? "Sending…" : "Send RSVP"}
              </button>
            </form>
          </AnimatedReveal>
        )}
      </div>
    </SectionSpacing>
  );
}
