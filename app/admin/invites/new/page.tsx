import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import {
  createInvite,
  DEFAULT_INTRO_LINE,
  defaultEventLine,
} from "@/lib/invites";
import {
  InviteEditorShell,
  type InviteDraftValues,
} from "@/components/admin/InviteEditorShell";
import styles from "@/styles/pages/Admin.module.scss";

function parseGallery(raw: string) {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    return parsed
      .filter(
        (item): item is { src: string; alt?: string } =>
          Boolean(item && typeof item === "object" && typeof (item as { src?: string }).src === "string"),
      )
      .map((item) => ({
        src: item.src,
        ...(item.alt ? { alt: item.alt } : {}),
      }));
  } catch {
    return undefined;
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

function emptyDraft(): InviteDraftValues {
  return {
    partnerOne: "",
    partnerTwo: "",
    eventAt: "",
    venueName: "",
    venueAddress: "",
    message: "",
    introLine: DEFAULT_INTRO_LINE,
    eventLine: defaultEventLine("wedding"),
    inviteMode: "wedding",
    scheduleItems: [
      { time: "14:00", label: "Ceremony" },
      { time: "18:00", label: "Reception" },
    ],
    venueLat: null,
    venueLng: null,
    dressCode: "",
    registryUrl: "",
    accommodationNote: "",
    rsvpDeadline: "",
    variantId: "classic",
    colourThemeId: "ivory",
    heroImage: "",
    galleryImages: [],
    published: true,
  };
}

export default async function NewInvitePage() {
  const user = await getSessionUser();
  if (!user?.id) redirect("/login");

  async function create(formData: FormData) {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");

    const partnerOne = String(formData.get("partnerOne") ?? "").trim();
    const partnerTwo = String(formData.get("partnerTwo") ?? "").trim();
    const eventAt = String(formData.get("eventAt") ?? "").trim();
    const venueName = String(formData.get("venueName") ?? "").trim();
    const venueAddress = String(formData.get("venueAddress") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const introLine = String(formData.get("introLine") ?? "").trim();
    const eventLine = String(formData.get("eventLine") ?? "").trim();
    const inviteMode =
      formData.get("inviteMode") === "save_the_date"
        ? "save_the_date"
        : "wedding";
    const scheduleItems = parseSchedule(
      String(formData.get("scheduleItems") ?? "[]"),
    );
    const venueLatRaw = String(formData.get("venueLat") ?? "").trim();
    const venueLngRaw = String(formData.get("venueLng") ?? "").trim();
    const dressCode = String(formData.get("dressCode") ?? "").trim();
    const registryUrl = String(formData.get("registryUrl") ?? "").trim();
    const accommodationNote = String(
      formData.get("accommodationNote") ?? "",
    ).trim();
    const rsvpDeadlineRaw = String(formData.get("rsvpDeadline") ?? "").trim();
    const variantId = String(formData.get("variantId") ?? "classic");
    const colourThemeId = String(formData.get("colourThemeId") ?? "ivory");
    const heroImage = String(formData.get("heroImage") ?? "").trim();
    const galleryImages = parseGallery(
      String(formData.get("galleryImages") ?? "[]"),
    );
    const published = formData.get("published") === "on";

    if (!partnerOne || !partnerTwo || !eventAt || !venueName) {
      redirect("/admin/invites/new?error=invalid");
    }

    const invite = await createInvite({
      userId: sessionUser.id,
      partnerOne,
      partnerTwo,
      eventAt: new Date(eventAt).toISOString(),
      venueName,
      venueAddress,
      message,
      introLine,
      eventLine,
      inviteMode,
      scheduleItems,
      venueLat: venueLatRaw ? Number(venueLatRaw) : null,
      venueLng: venueLngRaw ? Number(venueLngRaw) : null,
      dressCode: dressCode || undefined,
      registryUrl: registryUrl || undefined,
      accommodationNote: accommodationNote || undefined,
      rsvpDeadline: rsvpDeadlineRaw
        ? new Date(`${rsvpDeadlineRaw}T12:00:00`).toISOString()
        : null,
      variantId,
      colourThemeId,
      heroImage: heroImage || undefined,
      galleryImages,
      published,
    });

    redirect(`/admin/invites/${invite.id}`);
  }

  return (
    <div className={styles.shell}>
      <div className={`${styles.wrap} ${styles.wrapWide}`}>
        <header className={styles.header}>
          <Link href="/admin" className={styles.brand}>
            ← Admin
          </Link>
        </header>

        <div className={styles.pageHead}>
          <h1 className={styles.title}>New wedding invite</h1>
          <p className={styles.muted}>
            Choose a design, fill in the details, and preview live.
          </p>
        </div>

        <InviteEditorShell
          mode="create"
          initial={emptyDraft()}
          action={create}
          submitLabel="Create invite"
        />
      </div>
    </div>
  );
}
