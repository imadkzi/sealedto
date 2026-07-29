"use client";

import { useState } from "react";
import styles from "@/styles/pages/Admin.module.scss";
import guestStyles from "./GuestRowActions.module.scss";

type GuestRow = {
  id: string;
  display_name: string;
  is_curated: boolean;
  rsvp_status: string;
  party_size: number;
  personalUrl?: string;
};

interface Props {
  guest: GuestRow;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function GuestRowActions({ guest, updateAction, deleteAction }: Props) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!guest.personalUrl) return;
    try {
      await navigator.clipboard.writeText(guest.personalUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <tr>
      <td>
        {editing && guest.is_curated ? (
          <form action={updateAction} className={guestStyles.inlineForm}>
            <input type="hidden" name="guestId" value={guest.id} />
            <input
              className={styles.input}
              name="displayName"
              defaultValue={guest.display_name}
              required
              autoFocus
            />
            <div className={guestStyles.rowActions}>
              <button className={styles.button} type="submit">
                Save
              </button>
              <button
                className={styles.ghost}
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {guest.display_name}
            {guest.is_curated ? " · curated" : ""}
          </>
        )}
      </td>
      <td>{guest.rsvp_status}</td>
      <td>{guest.party_size}</td>
      <td>
        {guest.is_curated && guest.personalUrl ? (
          <div className={guestStyles.linkCell}>
            <a
              className={styles.publicLink}
              href={guest.personalUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => void copyLink()}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        ) : (
          <span className={styles.mono}>Public RSVP</span>
        )}
      </td>
      <td>
        {guest.is_curated ? (
          <div className={guestStyles.rowActions}>
            {!editing ? (
              <button
                className={styles.ghost}
                type="button"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            ) : null}
            <form action={deleteAction}>
              <input type="hidden" name="guestId" value={guest.id} />
              <button
                className={guestStyles.delete}
                type="submit"
                onClick={(event) => {
                  if (
                    !window.confirm(
                      `Remove ${guest.display_name} from this invite? Their personal link will stop working.`,
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                Delete
              </button>
            </form>
          </div>
        ) : (
          <form action={deleteAction}>
            <input type="hidden" name="guestId" value={guest.id} />
            <button
              className={guestStyles.delete}
              type="submit"
              onClick={(event) => {
                if (
                  !window.confirm(
                    `Remove ${guest.display_name}'s RSVP from this invite?`,
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              Delete
            </button>
          </form>
        )}
      </td>
    </tr>
  );
}
