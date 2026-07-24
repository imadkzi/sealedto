import type { Invite } from "@/lib/invites";
import type { Guest, RsvpStatus } from "@/lib/guests";
import styles from "@/styles/pages/Invite.module.scss";

export function formatWhen(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export type InviteLetterProps = {
  invite: Invite;
  guest?: Guest | null;
  mode: "public" | "curated";
  status: Exclude<RsvpStatus, "pending">;
  setStatus: (value: Exclude<RsvpStatus, "pending">) => void;
  name: string;
  setName: (value: string) => void;
  partySize: number;
  setPartySize: (value: number) => void;
  note: string;
  setNote: (value: string) => void;
  done: boolean;
  error: string | null;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
};

export function InviteLetter({
  invite,
  guest,
  mode,
  status,
  setStatus,
  name,
  setName,
  partySize,
  setPartySize,
  note,
  setNote,
  done,
  error,
  submitting,
  onSubmit,
  className,
}: InviteLetterProps) {
  return (
    <article className={`${styles.letter} ${className ?? ""}`}>
      <p className={styles.eyebrow}>
        {guest?.is_curated
          ? `${guest.display_name}, you are invited`
          : "You are invited to the wedding of"}
      </p>
      <h1 className={styles.names}>
        {invite.partner_one}
        <span className={styles.amp}>&</span>
        {invite.partner_two}
      </h1>
      <div className={styles.details}>
        <p>{formatWhen(invite.event_at)}</p>
        <p>{invite.venue_name}</p>
        {invite.venue_address ? <p>{invite.venue_address}</p> : null}
      </div>
      {invite.message ? <p className={styles.message}>{invite.message}</p> : null}

      {done ? (
        <div className={styles.thanks}>Thank you — your RSVP is sealed.</div>
      ) : (
        <form className={styles.rsvp} onSubmit={onSubmit}>
          {mode === "public" ? (
            <label className={styles.label}>
              Your name
              <input
                className={styles.input}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </label>
          ) : null}

          <div className={styles.statuses} role="group" aria-label="RSVP">
            {(["yes", "maybe", "no"] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={`${styles.status} ${status === value ? styles.statusActive : ""}`}
                onClick={() => setStatus(value)}
              >
                {value === "yes" ? "Yes" : value === "maybe" ? "Maybe" : "No"}
              </button>
            ))}
          </div>

          <label className={styles.label}>
            Party size
            <input
              className={styles.input}
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value) || 1)}
            />
          </label>

          <label className={styles.label}>
            Note (optional)
            <input
              className={styles.input}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Dietary needs, song requests…"
            />
          </label>

          {error ? <p className={styles.message}>{error}</p> : null}

          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send RSVP"}
          </button>
        </form>
      )}
    </article>
  );
}
