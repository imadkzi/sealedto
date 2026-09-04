import styles from "@/styles/pages/Home.module.scss";

/** Mobile timeline decoration: dashed rail that stretches with the step list. */
export function TimelineTrack() {
  return (
    <div className={styles.timelineTrack} aria-hidden>
      <span className={styles.timelineRail} />
    </div>
  );
}
