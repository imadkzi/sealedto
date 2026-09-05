"use client";

import { SectionSpacing, SectionTitle, AnimatedReveal, Divider } from "../core";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
}

export function DetailsSection({ invitation }: Props) {
  if (invitation.mode === "save_the_date") return null;

  const hasDressSides = Boolean(
    invitation.dressCodeGroom?.trim() || invitation.dressCodeBride?.trim(),
  );
  const hasDetails =
    hasDressSides ||
    invitation.dressCode ||
    invitation.registryUrl ||
    invitation.accommodationNote;

  if (!hasDetails) return null;

  return (
    <SectionSpacing id="details">
      <div className={styles.detailsBlock}>
        <SectionTitle>Details</SectionTitle>
        <Divider variant="line" />
        <div className={styles.detailsGrid}>
          {hasDressSides || invitation.dressCode ? (
            <AnimatedReveal variant="unfold">
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Dress code</p>
                {hasDressSides ? (
                  <div className={styles.dressSides}>
                    {invitation.dressCodeGroom?.trim() ? (
                      <div className={styles.dressSide}>
                        <p className={styles.dressSideLabel}>Groom side</p>
                        <p className={styles.detailBody}>
                          {invitation.dressCodeGroom}
                        </p>
                      </div>
                    ) : null}
                    {invitation.dressCodeBride?.trim() ? (
                      <div className={styles.dressSide}>
                        <p className={styles.dressSideLabel}>Bride side</p>
                        <p className={styles.detailBody}>
                          {invitation.dressCodeBride}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className={styles.detailBody}>{invitation.dressCode}</p>
                )}
              </div>
            </AnimatedReveal>
          ) : null}
          {invitation.accommodationNote ? (
            <AnimatedReveal variant="unfold" delay={0.1}>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Accommodation</p>
                <p className={styles.detailBody}>
                  {invitation.accommodationNote}
                </p>
              </div>
            </AnimatedReveal>
          ) : null}
          {invitation.registryUrl ? (
            <AnimatedReveal variant="unfold" delay={0.15}>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Gift registry</p>
                <a
                  className={styles.detailLink}
                  href={invitation.registryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View registry
                </a>
              </div>
            </AnimatedReveal>
          ) : null}
        </div>
      </div>
    </SectionSpacing>
  );
}
