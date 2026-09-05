"use client";

import { useEffect, useRef } from "react";
import { sanitizeIntroHtml } from "@/lib/introHtml";
import styles from "./IntroLineEditor.module.scss";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function IntroLineEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || focused.current) return;
    const next = sanitizeIntroHtml(value);
    if (el.innerHTML !== next) el.innerHTML = next;
  }, [value]);

  function emit() {
    const html = sanitizeIntroHtml(ref.current?.innerHTML ?? "");
    onChange(html);
  }

  function command(name: string) {
    document.execCommand(name, false);
    emit();
    ref.current?.focus();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.tool}
          onMouseDown={(event) => {
            event.preventDefault();
            command("bold");
          }}
        >
          Bold
        </button>
        <button
          type="button"
          className={styles.tool}
          onMouseDown={(event) => {
            event.preventDefault();
            command("italic");
          }}
        >
          Italic
        </button>
      </div>
      <div
        ref={ref}
        className={styles.editor}
        contentEditable
        dir="auto"
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={() => {
          focused.current = false;
          emit();
        }}
        onInput={emit}
      />
      <p className={styles.hint}>
        Use a second line for a translation. Italic keeps it quieter than the
        Arabic or main line.
      </p>
    </div>
  );
}
