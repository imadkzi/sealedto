"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Share } from "lucide-react";
import styles from "@/styles/pages/Admin.module.scss";
import guestStyles from "./GuestRowActions.module.scss";

interface Props {
  guestName: string;
  coupleNames: string;
  url: string;
}

export function GuestShareButton({ guestName, coupleNames, url }: Props) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState({ left: 0, bottom: 0 });

  const title = `${guestName}, you're invited`;
  const text = `${guestName}, you're invited — ${coupleNames}`;
  const message = `${text}\n${url}`;

  function placeMenu() {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setCoords({
      left: rect.left,
      bottom: window.innerHeight - rect.top + 8,
    });
  }

  useEffect(() => {
    if (!open) return;
    placeMenu();

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", placeMenu);
    window.addEventListener("scroll", placeMenu, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", placeMenu);
      window.removeEventListener("scroll", placeMenu, true);
    };
  }, [open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        setOpen(false);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    setOpen((current) => !current);
  }

  const menu =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            id={menuId}
            ref={menuRef}
            className={guestStyles.shareMenu}
            role="menu"
            style={{ left: coords.left, bottom: coords.bottom }}
          >
            <a
              role="menuitem"
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              WhatsApp
            </a>
            <a
              role="menuitem"
              href={`sms:?&body=${encodeURIComponent(message)}`}
              onClick={() => setOpen(false)}
            >
              Messages
            </a>
            <a
              role="menuitem"
              href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`}
              onClick={() => setOpen(false)}
            >
              Email
            </a>
            <button
              type="button"
              role="menuitem"
              onClick={() => void copyLink()}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={guestStyles.share}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.ghost}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => void share()}
      >
        <Share size={14} aria-hidden="true" />
        Share
      </button>
      {menu}
    </div>
  );
}
