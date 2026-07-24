import { randomBytes } from "node:crypto";

export function slugifyBase(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function makeInviteSlug(partnerOne: string, partnerTwo: string) {
  const base =
    slugifyBase(`${partnerOne}-${partnerTwo}`) ||
    slugifyBase("wedding") ||
    "wedding";
  const suffix = randomBytes(3).toString("hex");
  return `${base}-${suffix}`;
}

export function makeGuestToken() {
  return randomBytes(18).toString("base64url");
}
