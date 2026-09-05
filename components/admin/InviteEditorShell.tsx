"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_EVENT_LINE,
  DEFAULT_INTRO_LINE,
  DEFAULT_SAVE_THE_DATE_EVENT_LINE,
  defaultEventLine,
} from "@/lib/inviteDefaults";
import {
  PREVIEW_DRAFT_KEY,
  type InviteDraftValues,
} from "@/lib/invitePreview";

import "@/components/invite/templates/editorial";

import {
  getTemplate,
  resolveColourTheme,
  resolveVariant,
  FALLBACK_TEMPLATE_ID,
} from "@/components/invite/registry";
import { InviteDesignPicker } from "./InviteDesignPicker";
import { VenueLookup } from "./VenueLookup";
import { HeroImageField } from "./HeroImageField";
import { GalleryField } from "./GalleryField";
import { ItineraryField } from "./ItineraryField";
import { IntroLineEditor } from "./IntroLineEditor";
import adminStyles from "@/styles/pages/Admin.module.scss";
import styles from "./InviteEditorShell.module.scss";

export type { InviteDraftValues };

interface Props {
  mode: "create" | "edit";
  initial: InviteDraftValues;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  /** Extra content above the form (e.g. public link card). */
  beforeForm?: React.ReactNode;
  guestHref?: string;
}

function toDatetimeLocal(value: string) {
  if (!value) return "";
  if (value.length === 16 && value.includes("T")) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toDateLocal(value: string) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function InviteEditorShell({
  mode,
  initial,
  action,
  submitLabel,
  beforeForm,
  guestHref,
}: Props) {
  const steps = [
    "Design",
    "Couple",
    "Venue",
    "Photos",
    "Story",
    "Guests",
    "Publish",
  ] as const;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<InviteDraftValues>({
    ...initial,
    eventAt: toDatetimeLocal(initial.eventAt),
    rsvpDeadline: toDateLocal(initial.rsvpDeadline),
    introLine: initial.introLine || DEFAULT_INTRO_LINE,
    eventLine: initial.eventLine || defaultEventLine(initial.inviteMode),
    storyTitle: initial.storyTitle ?? "",
    dressCodeGroom: initial.dressCodeGroom ?? "",
    dressCodeBride: initial.dressCodeBride ?? "",
    galleryImages: initial.galleryImages ?? [],
    inviteMode: initial.inviteMode ?? "wedding",
    scheduleItems: initial.scheduleItems ?? [],
    venueLat: initial.venueLat ?? null,
    venueLng: initial.venueLng ?? null,
  });

  function patch(partial: Partial<InviteDraftValues>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  useEffect(() => {
    try {
      localStorage.setItem(PREVIEW_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore quota / private mode */
    }
  }, [draft]);

  const template = getTemplate(FALLBACK_TEMPLATE_ID)!;
  const colourTheme = resolveColourTheme(
    template,
    draft.colourThemeId || "ivory",
  );
  const variant = resolveVariant(template, draft.variantId || "classic");

  function openPreview() {
    try {
      localStorage.setItem(PREVIEW_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
    window.open("/admin/preview", "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.shell}>
      {beforeForm ? <div key="before-form">{beforeForm}</div> : null}

      <div className={styles.previewRow}>
        <div className={styles.previewCopy}>
          <span className={styles.previewLabel}>Live preview</span>
          <span className={styles.previewMeta}>
            {variant.name} · {colourTheme.name}
          </span>
        </div>
        <button
          type="button"
          className={adminStyles.button}
          onClick={openPreview}
        >
          Open live preview
        </button>
      </div>

      <nav className={styles.steps} aria-label="Invite setup">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={index === step ? styles.stepActive : styles.step}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </nav>

      <form
        action={action}
        className={`${adminStyles.form} ${styles.form}`}
        noValidate
        onSubmit={(event) => {
          if (
            !draft.partnerOne.trim() ||
            !draft.partnerTwo.trim() ||
            !draft.eventAt
          ) {
            event.preventDefault();
            setStep(1);
            return;
          }
          if (!draft.venueName.trim()) {
            event.preventDefault();
            setStep(2);
          }
        }}
      >
        <input type="hidden" name="introLine" value={draft.introLine} />
        <input type="hidden" name="eventLine" value={draft.eventLine} />
        <section className={step === 0 ? styles.stage : styles.stageHidden}>
          <h2 className={adminStyles.inviteTitle}>Choose your design</h2>
          <InviteDesignPicker
            variantId={draft.variantId}
            colourThemeId={draft.colourThemeId}
            onChange={(variantId, colourThemeId) =>
              patch({ variantId, colourThemeId })
            }
          />
        </section>

        <section className={step === 1 ? styles.stage : styles.stageHidden}>
          <h2 className={adminStyles.inviteTitle}>Couple & date</h2>
          <div className={adminStyles.row}>
            <label className={adminStyles.label}>
              Partner one
              <input
                className={adminStyles.input}
                name="partnerOne"
                value={draft.partnerOne}
                onChange={(e) => patch({ partnerOne: e.target.value })}
                required
              />
            </label>
            <label className={adminStyles.label}>
              Partner two
              <input
                className={adminStyles.input}
                name="partnerTwo"
                value={draft.partnerTwo}
                onChange={(e) => patch({ partnerTwo: e.target.value })}
                required
              />
            </label>
          </div>
          <label className={adminStyles.label}>
            Intro line
            <IntroLineEditor
              value={draft.introLine}
              onChange={(introLine) => patch({ introLine })}
              placeholder={DEFAULT_INTRO_LINE}
            />
          </label>
          <label className={adminStyles.label}>
            Event line
            <span className={adminStyles.muted}>
              Shown before the names. Change this if it isn’t a wedding.
            </span>
            <input
              className={adminStyles.input}
              value={draft.eventLine}
              onChange={(e) => patch({ eventLine: e.target.value })}
              placeholder={defaultEventLine(draft.inviteMode)}
            />
          </label>
          <label className={adminStyles.label}>
            Date & time
            <input
              className={adminStyles.input}
              type="datetime-local"
              name="eventAt"
              value={draft.eventAt}
              onChange={(e) => patch({ eventAt: e.target.value })}
              required
            />
          </label>
        </section>

        <section className={step === 2 ? styles.stage : styles.stageHidden}>
          <h2 className={adminStyles.inviteTitle}>Venue & itinerary</h2>
          <VenueLookup
            name={draft.venueName}
            address={draft.venueAddress}
            onNameChange={(venueName) => patch({ venueName })}
            onAddressChange={(venueAddress) => patch({ venueAddress })}
            onCoordinatesChange={(venueLat, venueLng) =>
              patch({ venueLat, venueLng })
            }
          />
          <input type="hidden" name="venueLat" value={draft.venueLat ?? ""} />
          <input type="hidden" name="venueLng" value={draft.venueLng ?? ""} />
          <ItineraryField
            value={draft.scheduleItems}
            onChange={(scheduleItems) => patch({ scheduleItems })}
          />
        </section>

        <section className={step === 3 ? styles.stage : styles.stageHidden}>
          <h2 className={adminStyles.inviteTitle}>Photos</h2>
          <HeroImageField
            value={draft.heroImage}
            onChange={(heroImage) => patch({ heroImage })}
          />
          <GalleryField
            value={draft.galleryImages}
            onChange={(galleryImages) => patch({ galleryImages })}
          />
        </section>

        <section className={step === 4 ? styles.stage : styles.stageHidden}>
          <h2 className={adminStyles.inviteTitle}>Story & details</h2>
          <label className={adminStyles.label}>
            Story title
            <input
              className={adminStyles.input}
              name="storyTitle"
              value={draft.storyTitle}
              onChange={(e) => patch({ storyTitle: e.target.value })}
              placeholder="Our Story"
            />
          </label>
          <label className={adminStyles.label}>
            Message
            <textarea
              className={adminStyles.textarea}
              name="message"
              value={draft.message}
              onChange={(e) => patch({ message: e.target.value })}
            />
          </label>
          <label className={adminStyles.label}>
            Groom side
            <input
              className={adminStyles.input}
              name="dressCodeGroom"
              value={draft.dressCodeGroom ?? ""}
              onChange={(e) => patch({ dressCodeGroom: e.target.value })}
              placeholder="Stone / champagne"
            />
          </label>
          <label className={adminStyles.label}>
            Bride side
            <input
              className={adminStyles.input}
              name="dressCodeBride"
              value={draft.dressCodeBride ?? ""}
              onChange={(e) => patch({ dressCodeBride: e.target.value })}
              placeholder="Mint green / sage"
            />
          </label>
          <label className={adminStyles.label}>
            Gift registry URL
            <input
              className={adminStyles.input}
              name="registryUrl"
              type="url"
              value={draft.registryUrl}
              onChange={(e) => patch({ registryUrl: e.target.value })}
              placeholder="https://…"
            />
          </label>
          <label className={adminStyles.label}>
            Accommodation note
            <textarea
              className={adminStyles.textarea}
              name="accommodationNote"
              value={draft.accommodationNote}
              onChange={(e) => patch({ accommodationNote: e.target.value })}
              placeholder="Hotel block details, travel tips…"
            />
          </label>
          <label className={adminStyles.label}>
            RSVP deadline
            <input
              className={adminStyles.input}
              type="date"
              name="rsvpDeadline"
              value={draft.rsvpDeadline}
              onChange={(e) => patch({ rsvpDeadline: e.target.value })}
            />
          </label>
        </section>

        <section className={step === 5 ? styles.stage : styles.stageHidden}>
          <h2 className={adminStyles.inviteTitle}>Guests</h2>
          {guestHref ? (
            <>
              <p className={adminStyles.muted}>
                Import guests, copy personal links, and track replies.
              </p>
              <a className={adminStyles.button} href={guestHref}>
                Manage guests
              </a>
            </>
          ) : (
            <p className={adminStyles.muted}>
              Create the invite first, then add guests and personal links.
            </p>
          )}
        </section>

        <section className={step === 6 ? styles.stage : styles.stageHidden}>
          <h2 className={adminStyles.inviteTitle}>Publish</h2>
          <label className={adminStyles.label}>
            Event line
            <input
              className={adminStyles.input}
              value={draft.eventLine}
              onChange={(e) => patch({ eventLine: e.target.value })}
              placeholder={defaultEventLine(draft.inviteMode)}
            />
          </label>
          <label className={adminStyles.label}>
            Invite type
            <select
              className={adminStyles.select}
              name="inviteMode"
              value={draft.inviteMode}
              onChange={(e) => {
                const inviteMode = e.target.value as
                  | "wedding"
                  | "save_the_date";
                const usingDefault =
                  draft.eventLine === DEFAULT_EVENT_LINE ||
                  draft.eventLine === DEFAULT_SAVE_THE_DATE_EVENT_LINE ||
                  !draft.eventLine.trim();
                patch({
                  inviteMode,
                  ...(usingDefault
                    ? { eventLine: defaultEventLine(inviteMode) }
                    : {}),
                });
              }}
            >
              <option value="wedding">Wedding invitation with RSVP</option>
              <option value="save_the_date">
                Save the date (no RSVP or detailed itinerary)
              </option>
            </select>
          </label>
          <input
            type="hidden"
            name="published"
            value={draft.published ? "on" : ""}
          />
          <label className={adminStyles.checkLabel}>
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => patch({ published: e.target.checked })}
            />
            {mode === "create"
              ? "Published (link goes live immediately)"
              : "Published"}
          </label>
          <button className={adminStyles.button} type="submit">
            {submitLabel}
          </button>
        </section>

        <div className={styles.wizardActions}>
          <button
            type="button"
            className={adminStyles.ghost}
            aria-disabled={step === 0}
            onClick={() => {
              if (step === 0) return;
              setStep((current) => Math.max(0, current - 1));
            }}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              className={adminStyles.button}
              onClick={() =>
                setStep((current) => Math.min(steps.length - 1, current + 1))
              }
            >
              Continue
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
