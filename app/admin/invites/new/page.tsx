import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { TEMPLATES, createInvite } from "@/lib/invites";
import styles from "@/styles/pages/Admin.module.scss";

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
    const templateId = String(formData.get("templateId") ?? "veil");
    const accentColor = String(formData.get("accentColor") ?? "#7a2e3a");
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
      templateId: TEMPLATES.find((t) => t.id === templateId)?.id ?? "veil",
      accentColor,
      published,
    });

    redirect(`/admin/invites/${invite.id}`);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <Link href="/admin" className={styles.brand}>
            ← Admin
          </Link>
        </header>

        <div className={styles.pageHead}>
          <h1 className={styles.title}>New wedding invite</h1>
          <p className={styles.muted}>
            Choose a template and fill in the details.
          </p>
        </div>

        <form action={create} className={styles.form}>
          <div className={styles.row}>
            <label className={styles.label}>
              Partner one
              <input className={styles.input} name="partnerOne" required />
            </label>
            <label className={styles.label}>
              Partner two
              <input className={styles.input} name="partnerTwo" required />
            </label>
          </div>
          <label className={styles.label}>
            Date & time
            <input
              className={styles.input}
              type="datetime-local"
              name="eventAt"
              required
            />
          </label>
          <label className={styles.label}>
            Venue
            <input className={styles.input} name="venueName" required />
          </label>
          <label className={styles.label}>
            Venue address
            <input className={styles.input} name="venueAddress" />
          </label>
          <label className={styles.label}>
            Message
            <textarea className={styles.textarea} name="message" />
          </label>
          <label className={styles.label}>
            Template
            <select
              className={styles.select}
              name="templateId"
              defaultValue="veil"
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
              defaultValue="#7a2e3a"
            />
          </label>
          <label className={styles.checkLabel}>
            <input type="checkbox" name="published" defaultChecked />
            Published (link goes live immediately)
          </label>
          <button className={styles.button} type="submit">
            Create invite
          </button>
        </form>
      </div>
    </div>
  );
}
