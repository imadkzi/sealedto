import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ShareKit } from "@/components/admin/ShareKit";
import { getSessionUser } from "@/lib/session";
import {
  DEFAULT_INTRO_LINE,
  deleteInvite,
  getInviteByIdForUser,
  updateInvite,
} from "@/lib/invites";
import { rsvpCounts } from "@/lib/guests";
import {
  InviteEditorShell,
  type InviteDraftValues,
} from "@/components/admin/InviteEditorShell";
import { DeleteInviteButton } from "@/components/admin/DeleteInviteButton";
import styles from "@/styles/pages/Admin.module.scss";

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toDateInputValue(date: Date | null) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseGallery(raw: string) {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter(
        (item): item is { src: string; alt?: string } =>
          Boolean(
            item &&
              typeof item === "object" &&
              typeof (item as { src?: string }).src === "string",
          ),
      )
      .map((item) => ({
        src: item.src,
        ...(item.alt ? { alt: item.alt } : {}),
      }));
  } catch {
    return null;
  }
}

function parseSchedule(raw: string) {
  try {
    const parsed = JSON.parse(raw) as Array<{
      time?: unknown;
      label?: unknown;
      description?: unknown;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          typeof item?.time === "string" &&
          typeof item?.label === "string" &&
          item.time.trim() &&
          item.label.trim(),
      )
      .map((item) => ({
        time: String(item.time).trim(),
        label: String(item.label).trim(),
        description:
          typeof item.description === "string"
            ? item.description.trim() || undefined
            : undefined,
      }));
  } catch {
    return [];
  }
}

export default async function InviteAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user?.id) redirect("/login");

  const { id } = await params;
  const invite = await getInviteByIdForUser(id, user.id);
  if (!invite) notFound();
  const counts = await rsvpCounts(invite.id);

  async function save(formData: FormData) {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");

    const heroImage = String(formData.get("heroImage") ?? "").trim();
    const galleryImages = parseGallery(
      String(formData.get("galleryImages") ?? "[]"),
    );
    const rsvpDeadlineRaw = String(formData.get("rsvpDeadline") ?? "").trim();
    const inviteMode =
      formData.get("inviteMode") === "save_the_date"
        ? "save_the_date"
        : "wedding";
    const scheduleItems = parseSchedule(
      String(formData.get("scheduleItems") ?? "[]"),
    );
    const venueLatRaw = String(formData.get("venueLat") ?? "").trim();
    const venueLngRaw = String(formData.get("venueLng") ?? "").trim();
    const published = formData.get("published") === "on";

    await updateInvite(id, sessionUser.id, {
      partnerOne: String(formData.get("partnerOne") ?? "").trim(),
      partnerTwo: String(formData.get("partnerTwo") ?? "").trim(),
      eventAt: new Date(String(formData.get("eventAt") ?? "")).toISOString(),
      venueName: String(formData.get("venueName") ?? "").trim(),
      venueAddress: String(formData.get("venueAddress") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      introLine: String(formData.get("introLine") ?? "").trim(),
      ceremonyTime: String(formData.get("ceremonyTime") ?? "").trim() || null,
      receptionTime: String(formData.get("receptionTime") ?? "").trim() || null,
      inviteMode,
      scheduleItems,
      venueLat: venueLatRaw ? Number(venueLatRaw) : null,
      venueLng: venueLngRaw ? Number(venueLngRaw) : null,
      dressCode: String(formData.get("dressCode") ?? "").trim() || null,
      registryUrl: String(formData.get("registryUrl") ?? "").trim() || null,
      accommodationNote:
        String(formData.get("accommodationNote") ?? "").trim() || null,
      rsvpDeadline: rsvpDeadlineRaw
        ? new Date(`${rsvpDeadlineRaw}T12:00:00`).toISOString()
        : null,
      variantId: String(formData.get("variantId") ?? "classic"),
      colourThemeId: String(formData.get("colourThemeId") ?? "ivory"),
      heroImage: heroImage || null,
      galleryImages,
      published,
    });
    redirect(`/admin/invites/${id}`);
  }

  async function removeInvite() {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");
    await deleteInvite(id, sessionUser.id);
    redirect("/admin");
  }

  const publicPath = `/i/${invite.slug}`;
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}${publicPath}`;

  const initial: InviteDraftValues = {
    partnerOne: invite.partner_one,
    partnerTwo: invite.partner_two,
    eventAt: toLocalInputValue(new Date(invite.event_at)),
    venueName: invite.venue_name,
    venueAddress: invite.venue_address ?? "",
    message: invite.message ?? "",
    introLine: invite.intro_line || DEFAULT_INTRO_LINE,
    ceremonyTime: invite.ceremony_time ?? "",
    receptionTime: invite.reception_time ?? "",
    inviteMode: invite.invite_mode ?? "wedding",
    scheduleItems:
      invite.schedule_items ??
      [
        invite.ceremony_time
          ? { time: invite.ceremony_time, label: "Ceremony" }
          : null,
        invite.reception_time
          ? { time: invite.reception_time, label: "Reception" }
          : null,
      ].filter(
        (item): item is { time: string; label: string } => item !== null,
      ),
    venueLat: invite.venue_lat,
    venueLng: invite.venue_lng,
    dressCode: invite.dress_code ?? "",
    registryUrl: invite.registry_url ?? "",
    accommodationNote: invite.accommodation_note ?? "",
    rsvpDeadline: toDateInputValue(invite.rsvp_deadline),
    variantId: invite.variant_id ?? "classic",
    colourThemeId: invite.colour_theme_id ?? "ivory",
    heroImage: invite.hero_image ?? "",
    galleryImages: invite.gallery_images ?? [],
    published: invite.published,
  };

  return (
    <div className={styles.shell}>
      <div className={`${styles.wrap} ${styles.wrapWide}`}>
        <header className={styles.header}>
          <Link href="/admin" className={styles.brand}>
            ← Admin
          </Link>
          <div className={styles.actions}>
            <Link
              className={styles.ghost}
              href={`/admin/invites/${invite.id}/guests`}
            >
              Guests
            </Link>
            <Link className={styles.button} href={publicPath} target="_blank">
              Open invite
            </Link>
            <DeleteInviteButton
              inviteId={invite.id}
              inviteName={`${invite.partner_one} & ${invite.partner_two}`}
              action={removeInvite}
              label="Delete invite"
            />
          </div>
        </header>

        <div className={styles.pageHead}>
          <h1 className={styles.title}>
            {invite.partner_one} & {invite.partner_two}
          </h1>
          <p className={styles.muted}>
            {invite.published
              ? "Published — guests can open the public link"
              : "Draft — publish to activate the guest link"}
          </p>
        </div>

        <div className={styles.counts}>
          <div className={styles.count}>
            <strong>{counts.yes}</strong>
            <span>Yes</span>
          </div>
          <div className={styles.count}>
            <strong>{counts.maybe}</strong>
            <span>Maybe</span>
          </div>
          <div className={styles.count}>
            <strong>{counts.no}</strong>
            <span>No</span>
          </div>
          <div className={styles.count}>
            <strong>{counts.pending}</strong>
            <span>Pending</span>
          </div>
        </div>

        <InviteEditorShell
          mode="edit"
          initial={initial}
          action={save}
          submitLabel="Save changes"
          guestHref={`/admin/invites/${invite.id}/guests`}
          beforeForm={
            <ShareKit
              inviteId={invite.id}
              publicUrl={publicUrl}
              published={invite.published}
              title={`${invite.partner_one} & ${invite.partner_two} wedding invite`}
            />
          }
        />
      </div>
    </div>
  );
}
