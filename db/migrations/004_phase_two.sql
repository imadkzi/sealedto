-- Phase 2: flexible itinerary, invite mode, and venue coordinates.

alter table invites
  add column if not exists invite_mode text not null default 'wedding'
    check (invite_mode in ('wedding', 'save_the_date')),
  add column if not exists schedule_items jsonb,
  add column if not exists venue_lat double precision,
  add column if not exists venue_lng double precision;

-- Preserve the Phase 1 ceremony/reception values as flexible itinerary items.
update invites
set schedule_items =
  case when nullif(ceremony_time, '') is not null
    then jsonb_build_array(jsonb_build_object(
      'time', ceremony_time, 'label', 'Ceremony'
    ))
    else '[]'::jsonb
  end
  ||
  case when nullif(reception_time, '') is not null
    then jsonb_build_array(jsonb_build_object(
      'time', reception_time, 'label', 'Reception'
    ))
    else '[]'::jsonb
  end
where schedule_items is null
  and (nullif(ceremony_time, '') is not null or nullif(reception_time, '') is not null);
