-- Wedding-native invite fields.

alter table invites
  add column if not exists intro_line text not null default 'Together with their families',
  add column if not exists ceremony_time text,
  add column if not exists reception_time text,
  add column if not exists dress_code text,
  add column if not exists registry_url text,
  add column if not exists accommodation_note text,
  add column if not exists rsvp_deadline timestamptz;
