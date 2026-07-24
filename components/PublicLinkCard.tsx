"use client";

import { useState } from "react";
import styles from "@/styles/pages/Admin.module.scss";

type Props = {
  url: string;
  published: boolean;
  title: string;
};

export function PublicLinkCard({ url, published, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  async function copyLink() {
    setShareError(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setShareError("Could not copy — select the link instead.");
    }
  }

  async function shareLink() {
    setShareError(null);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: "You're invited",
          url,
        });
        return;
      } catch (error) {
        if ((error as { name?: string } | null)?.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.inviteTitle}>Public link</h2>
      {!published ? (
        <p className={styles.muted}>
          This invite is still a <strong>draft</strong>, so guests will see a
          404. Tick <strong>Published</strong> below and save to activate the
          link.
        </p>
      ) : (
        <p className={styles.muted}>
          Guests enter their name when they RSVP. Curated personal links live on
          the guests page.
        </p>
      )}

      <div className={styles.copyRow}>
        <a
          className={styles.publicLink}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {url}
        </a>
      </div>

      <div className={styles.copyRow}>
        <button type="button" className={styles.button} onClick={shareLink}>
          Share
        </button>
        <button type="button" className={styles.ghost} onClick={copyLink}>
          {copied ? "Copied" : "Copy link"}
        </button>
        <a className={styles.ghost} href={url} target="_blank" rel="noreferrer">
          Open
        </a>
      </div>
      {shareError ? <p className={styles.muted}>{shareError}</p> : null}
    </div>
  );
}
