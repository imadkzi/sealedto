"use client";

import type { TemplateProps } from "../../types";
import { ClassicLayout } from "./variants/classic";
import { SplitLayout } from "./variants/split";
import { MinimalLayout } from "./variants/minimal";
import { GalleryLayout } from "./variants/gallery";
import { FullscreenLayout } from "./variants/fullscreen";

const layouts = {
  classic: ClassicLayout,
  split: SplitLayout,
  minimal: MinimalLayout,
  gallery: GalleryLayout,
  fullscreen: FullscreenLayout,
} as const;

export function EditorialTemplate({ invitation, rsvp, variantId }: TemplateProps) {
  const Layout = layouts[variantId] ?? layouts.classic;
  return <Layout invitation={invitation} rsvp={rsvp} />;
}
