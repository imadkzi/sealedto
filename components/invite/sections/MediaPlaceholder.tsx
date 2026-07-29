"use client";

import styles from "./sections.module.scss";

interface Props {
  label?: string;
  fullscreen?: boolean;
}

export function MediaPlaceholder({
  label = "Photo coming soon",
  fullscreen = false,
}: Props) {
  return (
    <div
      className={
        fullscreen ? styles.mediaPlaceholderFullscreen : styles.mediaPlaceholder
      }
      aria-hidden
    >
      {label}
    </div>
  );
}
