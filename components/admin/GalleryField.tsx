"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, GripVertical } from "lucide-react";
import adminStyles from "@/styles/pages/Admin.module.scss";
import styles from "./GalleryField.module.scss";

export type GalleryImage = { src: string; alt?: string };

interface Props {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

export function GalleryField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of list) {
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
        uploaded.push({ src: data.url });
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function onReorder(from: number, to: number) {
    if (from === to) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <span className={styles.title}>Gallery</span>
        <span className={styles.meta}>{value.length} photos</span>
      </div>

      <input
        type="hidden"
        name="galleryImages"
        value={JSON.stringify(value)}
      />

      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files?.length) {
            void uploadFiles(event.dataTransfer.files);
          }
        }}
      >
        <ImagePlus size={20} />
        <p>{uploading ? "Uploading…" : "Drop photos here, or choose files"}</p>
        <button
          type="button"
          className={adminStyles.ghost}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Add photos
        </button>
        <input
          ref={inputRef}
          className={styles.fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(event) => {
            if (event.target.files?.length) void uploadFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {value.length > 0 ? (
        <ul className={styles.grid}>
          {value.map((image, index) => (
            <li
              key={`${image.src}-${index}`}
              className={styles.item}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) onReorder(dragIndex, index);
                setDragIndex(null);
              }}
            >
              <span className={styles.handle} aria-hidden>
                <GripVertical size={14} />
              </span>
              <img src={image.src} alt={image.alt ?? ""} />
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeAt(index)}
                aria-label="Remove photo"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
