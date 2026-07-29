"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import adminStyles from "@/styles/pages/Admin.module.scss";
import styles from "./ItineraryField.module.scss";

export type ItineraryItem = {
  time: string;
  label: string;
  description?: string;
};

interface Props {
  value: ItineraryItem[];
  onChange: (items: ItineraryItem[]) => void;
}

export function ItineraryField({ value, onChange }: Props) {
  function update(index: number, patch: Partial<ItineraryItem>) {
    onChange(
      value.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <fieldset className={styles.field}>
      <input type="hidden" name="scheduleItems" value={JSON.stringify(value)} />
      <div className={styles.head}>
        <div>
          <legend className={styles.title}>Day itinerary</legend>
          <p className={styles.help}>
            Add every event guests should know about, in display order.
          </p>
        </div>
        <button
          type="button"
          className={adminStyles.ghost}
          onClick={() =>
            onChange([...value, { time: "", label: "", description: "" }])
          }
        >
          <Plus size={15} /> Add event
        </button>
      </div>

      {value.length === 0 ? (
        <button
          type="button"
          className={styles.empty}
          onClick={() =>
            onChange([{ time: "14:00", label: "Ceremony", description: "" }])
          }
        >
          No itinerary events yet. Add the first event.
        </button>
      ) : (
        <div className={styles.list}>
          {value.map((item, index) => (
            <div className={styles.item} key={index}>
              <div className={styles.reorder}>
                <GripVertical size={16} aria-hidden />
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move event up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                  aria-label="Move event down"
                >
                  ↓
                </button>
              </div>
              <div className={styles.inputs}>
                <div className={adminStyles.row}>
                  <label className={adminStyles.label}>
                    Time
                    <input
                      className={adminStyles.input}
                      type="time"
                      value={item.time}
                      onChange={(event) =>
                        update(index, { time: event.target.value })
                      }
                    />
                  </label>
                  <label className={adminStyles.label}>
                    Event
                    <input
                      className={adminStyles.input}
                      value={item.label}
                      onChange={(event) =>
                        update(index, { label: event.target.value })
                      }
                      placeholder="Ceremony"
                    />
                  </label>
                </div>
                <label className={adminStyles.label}>
                  Optional note
                  <input
                    className={adminStyles.input}
                    value={item.description ?? ""}
                    onChange={(event) =>
                      update(index, { description: event.target.value })
                    }
                    placeholder="Please arrive 15 minutes early"
                  />
                </label>
              </div>
              <button
                type="button"
                className={styles.remove}
                onClick={() =>
                  onChange(value.filter((_, itemIndex) => itemIndex !== index))
                }
                aria-label={`Remove ${item.label || "event"}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}
