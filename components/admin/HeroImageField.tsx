"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Trash2, Upload } from "lucide-react";
import adminStyles from "@/styles/pages/Admin.module.scss";
import styles from "./HeroImageField.module.scss";

interface Props {
  value?: string;
  onChange?: (url: string) => void;
  /** Uncontrolled fallback for simple forms. */
  initialUrl?: string;
  name?: string;
}

export function HeroImageField({
  value,
  onChange,
  initialUrl = "",
  name = "heroImage",
}: Props) {
  const controlled = value !== undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalUrl, setInternalUrl] = useState(initialUrl);
  const url = controlled ? value : internalUrl;
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function setUrl(next: string) {
    if (!controlled) setInternalUrl(next);
    onChange?.(next);
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/uploads", {
        method: "POST",
        body,
      });
      const data = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed");
      }
      setUrl(data.url);
      setMode("upload");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadFile(file);
    event.target.value = "";
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <span className={styles.title}>Hero image</span>
        <div className={styles.modes}>
          <button
            type="button"
            className={`${styles.mode} ${mode === "upload" ? styles.modeActive : ""}`}
            onClick={() => setMode("upload")}
          >
            <Upload size={14} />
            Upload
          </button>
          <button
            type="button"
            className={`${styles.mode} ${mode === "url" ? styles.modeActive : ""}`}
            onClick={() => setMode("url")}
          >
            <Link2 size={14} />
            URL
          </button>
        </div>
      </div>

      <input type="hidden" name={name} value={url} />

      {mode === "upload" ? (
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <ImagePlus size={22} />
          <p>
            {uploading
              ? "Uploading…"
              : "Drop a photo here, or choose a file"}
          </p>
          <span>JPEG, PNG, WebP or GIF · max 8MB</span>
          <button
            type="button"
            className={adminStyles.ghost}
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            Choose photo
          </button>
          <input
            ref={inputRef}
            className={styles.fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
          />
        </div>
      ) : (
        <label className={adminStyles.label}>
          Image URL
          <input
            className={adminStyles.input}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://…"
          />
        </label>
      )}

      {error ? <p className={styles.error}>{error}</p> : null}

      {url ? (
        <div className={styles.preview}>
          <img src={url} alt="Hero preview" />
          <button
            type="button"
            className={styles.remove}
            onClick={() => setUrl("")}
            aria-label="Remove hero image"
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
