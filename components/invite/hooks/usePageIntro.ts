"use client";

import { useState, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function usePageIntro() {
  const [introDone, setIntroDone] = useState(false);
  const reduced = useReducedMotion();

  const onIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  return { introDone, onIntroComplete, skipIntro: reduced };
}
