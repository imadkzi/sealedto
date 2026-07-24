import { describe, expect, it } from "vitest";
import { makeGuestToken, makeInviteSlug, slugifyBase } from "./ids";

describe("slugifyBase", () => {
  it("normalizes names into url-safe slugs", () => {
    expect(slugifyBase("Amélie & José")).toBe("amelie-jose");
  });
});

describe("makeInviteSlug", () => {
  it("includes both partners and a suffix", () => {
    const slug = makeInviteSlug("Ada", "Grace");
    expect(slug.startsWith("ada-grace-")).toBe(true);
    expect(slug.length).toBeGreaterThan("ada-grace-".length);
  });
});

describe("makeGuestToken", () => {
  it("returns an unguessable token", () => {
    const a = makeGuestToken();
    const b = makeGuestToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(16);
  });
});
