import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PublicLinkCard } from "@/components/PublicLinkCard";
import { getSessionUser } from "@/lib/session";
import {
  TEMPLATES,
  getInviteByIdForUser,
  updateInvite,
} from "@/lib/invites";
import { rsvpCounts } from "@/lib/guests";
import styles from "@/styles/pages/Admin.module.scss";

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

    const published = formData.get("published") === "on";
    await updateInvite(id, sessionUser.id, {
      partnerOne: String(formData.get("partnerOne") ?? "").trim(),
      partnerTwo: String(formData.get("partnerTwo") ?? "").trim(),
      eventAt: new Date(String(formData.get("eventAt") ?? "")).toISOString(),
      venueName: String(formData.get("venueName") ?? "").trim(),
      venueAddress: String(formData.get("venueAddress") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      templateId:
        TEMPLATES.find((t) => t.id === String(formData.get("templateId")))?.id ??
        "veil",
      accentColor: String(formData.get("accentColor") ?? "#7a2e3a"),
      published,
    });
    redirect(`/admin/invites/${id}`);
  }

  const publicPath = `/i/${invite.slug}`;
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}${publicPath}`;

  return (
    <div className={styles.shell}>
      <div className={styles.wrap}>
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

        <div className={styles.detailLayout}>
          <PublicLinkCard
            url={publicUrl}
            published={invite.published}
            title={`${invite.partner_one} & ${invite.partner_two} wedding invite`}
          />

          <form action={save} className={styles.form}>
            <h2 className={styles.inviteTitle}>Invite details</h2>
            <div className={styles.row}>
              <label className={styles.label}>
                Partner one
                <input
                  className={styles.input}
                  name="partnerOne"
                  defaultValue={invite.partner_one}
                  required
                />
              </label>
              <label className={styles.label}>
                Partner two
                <input
                  className={styles.input}
                  name="partnerTwo"
                  defaultValue={invite.partner_two}
                  required
                />
              </label>
            </div>
            <label className={styles.label}>
              Date & time
              <input
                className={styles.input}
                type="datetime-local"
                name="eventAt"
                defaultValue={toLocalInputValue(new Date(invite.event_at))}
                required
              />
            </label>
            <label className={styles.label}>
              Venue
              <input
                className={styles.input}
                name="venueName"
                defaultValue={invite.venue_name}
                required
              />
            </label>
            <label className={styles.label}>
              Venue address
              <input
                className={styles.input}
                name="venueAddress"
                defaultValue={invite.venue_address ?? ""}
              />
            </label>
            <label className={styles.label}>
              Message
              <textarea
                className={styles.textarea}
                name="message"
                defaultValue={invite.message ?? ""}
              />
            </label>
            <label className={styles.label}>
              Template
              <select
                className={styles.select}
                name="templateId"
                defaultValue={invite.template_id}
              >
                {TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Accent colour
              <input
                className={styles.input}
                type="color"
                name="accentColor"
                defaultValue={invite.accent_color}
              />
            </label>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                name="published"
                defaultChecked={invite.published}
              />
              Published
            </label>
            <button className={styles.button} type="submit">
              Save changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
