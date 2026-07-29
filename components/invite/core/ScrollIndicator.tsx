"use client";

import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "../hooks";

export function ScrollIndicator() {
  const progress = useScrollProgress();
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          background: "var(--invite-accent, #b79b7a)",
        }}
      />
    </div>
  );
}
