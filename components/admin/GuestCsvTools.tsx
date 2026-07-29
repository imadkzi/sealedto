"use client";

import { useRef, useState } from "react";
import adminStyles from "@/styles/pages/Admin.module.scss";
import styles from "./GuestCsvTools.module.scss";

export type GuestCsvRow = {
  display_name: string;
  rsvp_status: string;
  party_size: number;
  rsvp_note: string | null;
  is_curated: boolean;
  token: string;
};

interface Props {
  inviteId: string;
  guests: GuestCsvRow[];
  origin: string;
  importAction: (formData: FormData) => Promise<void>;
}

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function GuestCsvTools({
  inviteId,
  guests,
  origin,
  importAction,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [paste, setPaste] = useState("");
  const [importing, setImporting] = useState(false);

  function exportCsv() {
    const header = ["name", "status", "party_size", "note", "curated_link"];
    const lines = [
      header.join(","),
      ...guests.map((guest) =>
        [
          csvEscape(guest.display_name),
          csvEscape(guest.rsvp_status),
          String(guest.party_size),
          csvEscape(guest.rsvp_note ?? ""),
          guest.is_curated
            ? csvEscape(`${origin}/g/${guest.token}`)
            : "",
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `guests-${inviteId.slice(0, 8)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function parseNames(text: string) {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // Support "name" or "name,email" — take first column
        const first = line.split(",")[0]?.trim() ?? "";
        return first.replace(/^"|"$/g, "").trim();
      })
      .filter((name) => name && name.toLowerCase() !== "name");
  }

  async function runImport(names: string[]) {
    if (!names.length) return;
    setImporting(true);
    try {
      const body = new FormData();
      body.set("names", names.join("\n"));
      await importAction(body);
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className={styles.tools}>
      <div className={styles.head}>
        <h2 className={adminStyles.inviteTitle}>CSV import / export</h2>
        <button
          type="button"
          className={adminStyles.ghost}
          onClick={exportCsv}
          disabled={guests.length === 0}
        >
          Export CSV
        </button>
      </div>
      <p className={adminStyles.muted}>
        Import one guest name per line (optional header <code>name</code>).
        Export includes status, party size, note, and curated links.
      </p>

      <label className={adminStyles.label}>
        Paste names
        <textarea
          className={adminStyles.textarea}
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder={"Alex Chen\nJordan Lee\nSam Rivera"}
        />
      </label>

      <div className={styles.actions}>
        <button
          type="button"
          className={adminStyles.button}
          disabled={importing || !paste.trim()}
          onClick={() => void runImport(parseNames(paste))}
        >
          {importing ? "Importing…" : "Import pasted names"}
        </button>
        <button
          type="button"
          className={adminStyles.ghost}
          disabled={importing}
          onClick={() => fileRef.current?.click()}
        >
          Upload CSV
        </button>
        <input
          ref={fileRef}
          className={styles.fileInput}
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const text = String(reader.result ?? "");
              void runImport(parseNames(text));
            };
            reader.readAsText(file);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
