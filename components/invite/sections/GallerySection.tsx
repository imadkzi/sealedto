"use client";

import { motion } from "framer-motion";
import { SectionSpacing, SectionTitle, Divider } from "../core";
import { useStagger } from "../hooks";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
  layout?: "default" | "immersive" | "split";
}

export function GallerySection({ invitation, layout = "default" }: Props) {
  const { container, item } = useStagger({ variant: "scale", stagger: 0.09 });
  if (!invitation.gallery?.length) return null;

  const galleryClass =
    layout === "immersive"
      ? styles.galleryImmersive
      : layout === "split"
        ? styles.gallerySplit
        : styles.gallery;

  return (
    <SectionSpacing id="gallery">
      <SectionTitle>Gallery</SectionTitle>
      <Divider variant="wave" />
      <motion.div
        className={galleryClass}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {invitation.gallery.map((img, i) => (
          <motion.div key={i} className={styles.galleryItem} variants={item}>
            <img
              src={img.src}
              alt={img.alt ?? ""}
              className={styles.galleryImage}
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </SectionSpacing>
  );
}
