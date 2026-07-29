-- Editorial variant family: add variant, colour theme, and media columns.

alter table invites
  add column if not exists variant_id text not null default 'classic',
  add column if not exists colour_theme_id text not null default 'ivory',
  add column if not exists hero_image text,
  add column if not exists gallery_images jsonb;

-- Backfill existing rows: map accent_color-based styling to ivory theme.
-- accent_color column kept for backward compat but no longer used by admin.
