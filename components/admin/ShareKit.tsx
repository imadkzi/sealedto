"use client";

import { useState } from "react";
import adminStyles from "@/styles/pages/Admin.module.scss";
import styles from "./ShareKit.module.scss";

interface Props {
  inviteId: string;
  publicUrl: string;
  title: string;
  published: boolean;
}

export function ShareKit({ inviteId, publicUrl, title, published }: Props) {
  const [copied, setCopied] = useState<"link" | "invite" | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const message = `${title}\n${publicUrl}`;

  async function copyText(text: string, kind: "link" | "invite") {
    setShareError(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setShareError("Could not copy — select the link instead.");
    }
  }

  async function shareNative() {
    setShareError(null);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: "You're invited",
          url: publicUrl,
        });
        return;
      } catch (error) {
        if ((error as { name?: string } | null)?.name === "AbortError") return;
      }
    }
    await copyText(publicUrl, "link");
  }

  return (
    <section className={styles.card}>
      <div className={styles.copy}>
        <h2 className={adminStyles.inviteTitle}>Share invite</h2>
        {!published ? (
          <p className={adminStyles.muted}>
            This invite is still a <strong>draft</strong>, so guests will see a
            404. Publish and save to activate the link.
          </p>
        ) : (
          <p className={adminStyles.muted}>
            Guests enter their name when they RSVP. Curated personal links live
            on the guests page.
          </p>
        )}

        <a
          className={adminStyles.publicLink}
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
        >
          {publicUrl}
        </a>

        <div className={styles.actions}>
          <button
            type="button"
            className={adminStyles.button}
            onClick={() => void shareNative()}
          >
            Share
          </button>
          <button
            type="button"
            className={adminStyles.ghost}
            onClick={() => void copyText(publicUrl, "link")}
          >
            {copied === "link" ? "Copied" : "Copy link"}
          </button>
          <button
            type="button"
            className={adminStyles.ghost}
            onClick={() => void copyText(message, "invite")}
          >
            {copied === "invite" ? "Copied" : "Copy invite"}
          </button>
          <a
            className={adminStyles.ghost}
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open
          </a>
          <a
            className={adminStyles.ghost}
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            className={adminStyles.ghost}
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`}
          >
            Email
          </a>
        </div>
        {shareError ? <p className={adminStyles.muted}>{shareError}</p> : null}
      </div>

      <a
        className={styles.qr}
        href={`/api/invites/${inviteId}/qr`}
        download={`invite-${inviteId.slice(0, 8)}-qr.svg`}
        title="Download QR code"
      >
        <img src={`/api/invites/${inviteId}/qr`} alt="Invitation QR code" />
        <span>Download QR</span>
      </a>
    </section>
  );
}
