"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import adminStyles from "@/styles/pages/Admin.module.scss";
import styles from "./VenueLookup.module.scss";

type Place = {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
};

interface Props {
  initialName?: string;
  initialAddress?: string;
  /** Controlled venue name (optional). */
  name?: string;
  /** Controlled venue address (optional). */
  address?: string;
  onNameChange?: (name: string) => void;
  onAddressChange?: (address: string) => void;
  onCoordinatesChange?: (lat: number | null, lng: number | null) => void;
}

export function VenueLookup({
  initialName = "",
  initialAddress = "",
  name: controlledName,
  address: controlledAddress,
  onNameChange,
  onAddressChange,
  onCoordinatesChange,
}: Props) {
  const nameControlled = controlledName !== undefined;
  const addressControlled = controlledAddress !== undefined;

  const [internalName, setInternalName] = useState(initialName);
  const [internalAddress, setInternalAddress] = useState(initialAddress);
  const [selectedAddress, setSelectedAddress] = useState(
    addressControlled ? controlledAddress : initialAddress,
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);

  const name = nameControlled ? controlledName : internalName;
  const address = addressControlled ? controlledAddress : internalAddress;

  function setName(next: string) {
    if (!nameControlled) setInternalName(next);
    onNameChange?.(next);
  }

  function setAddress(next: string) {
    if (!addressControlled) setInternalAddress(next);
    onAddressChange?.(next);
  }

  useEffect(() => {
    if (address.trim().length < 3 || address === selectedAddress) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(address)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as { places?: Place[] };
        setPlaces(data.places ?? []);
        setOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setPlaces([]);
        }
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [address, selectedAddress]);

  function selectPlace(place: Place) {
    setName(place.name);
    setAddress(place.address || place.name);
    setSelectedAddress(place.address || place.name);
    onCoordinatesChange?.(place.lat ?? null, place.lng ?? null);
    setPlaces([]);
    setOpen(false);
  }

  return (
    <>
      <label className={adminStyles.label}>
        Venue
        <input
          className={adminStyles.input}
          name="venueName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>

      <label className={adminStyles.label}>
        Venue address
        <span className={styles.lookup}>
          <MapPin className={styles.icon} size={16} aria-hidden />
          <input
            className={`${adminStyles.input} ${styles.input}`}
            name="venueAddress"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              onCoordinatesChange?.(null, null);
              setSelectedAddress("");
              setPlaces([]);
            }}
            onFocus={() => places.length > 0 && setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            placeholder="Start typing an address or venue…"
            autoComplete="off"
          />

          {searching ? (
            <span className={styles.status}>Searching…</span>
          ) : null}

          {open && places.length > 0 ? (
            <span className={styles.results} role="listbox">
              {places.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  className={styles.result}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectPlace(place)}
                  role="option"
                  aria-selected="false"
                >
                  <strong>{place.name}</strong>
                  <span>{place.address}</span>
                </button>
              ))}
            </span>
          ) : null}
        </span>
      </label>
    </>
  );
}
