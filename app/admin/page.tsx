import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";
import { listInvitesForUser, deleteInvite } from "@/lib/invites";
import { rsvpCounts } from "@/lib/guests";
import { DeleteInviteButton } from "@/components/admin/DeleteInviteButton";
import styles from "@/styles/pages/Admin.module.scss";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user?.id) redirect("/login");

  const invites = await listInvitesForUser(user.id);
  const inviteStats = new Map(
    await Promise.all(
      invites.map(async (invite) => [
        invite.id,
        await rsvpCounts(invite.id),
      ] as const),
    ),
  );

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  async function removeInvite(formData: FormData) {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");
    const inviteId = String(formData.get("inviteId") ?? "").trim();
    if (!inviteId) redirect("/admin");
    await deleteInvite(inviteId, sessionUser.id);
    redirect("/admin");
  }

  return (
    <div className={styles.shell}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            Sealedto
          </Link>
          <div className={styles.actions}>
            <Link className={styles.button} href="/admin/invites/new">
              New invite
            </Link>
            <form action={logout}>
              <button className={styles.ghost} type="submit">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className={styles.pageHead}>
          <h1 className={styles.title}>Your invites</h1>
          <p className={styles.muted}>
            Create, publish, and collect RSVPs for the wedding.
          </p>
        </div>

        {invites.length === 0 ? (
          <div className={styles.empty}>
            <h2 className={styles.inviteTitle}>No invites yet</h2>
            <p className={styles.muted}>
              Create your first invite and collect RSVPs.
            </p>
            <Link className={styles.button} href="/admin/invites/new">
              Create invite
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {invites.map((invite) => (
              <article key={invite.id} className={styles.inviteCard}>
                <div className={styles.inviteCardTop}>
                  <span
                    className={`${styles.badge} ${invite.published ? "" : styles.badgeDraft}`}
                  >
                    {invite.published ? "Published" : "Draft"}
                  </span>
                  <div className={styles.inviteCardActions}>
                    <Link
                      className={styles.editLink}
                      href={`/admin/invites/${invite.id}`}
                    >
                      Edit
                    </Link>
                    <DeleteInviteButton
                      inviteId={invite.id}
                      inviteName={`${invite.partner_one} & ${invite.partner_two}`}
                      action={removeInvite}
                    />
                  </div>
                </div>
                <h2 className={styles.inviteTitle}>
                  <Link href={`/admin/invites/${invite.id}`}>
                    {invite.partner_one} & {invite.partner_two}
                  </Link>
                </h2>
                <p className={styles.muted}>{invite.venue_name}</p>
                {(() => {
                  const stats = inviteStats.get(invite.id) ?? {
                    yes: 0,
                    maybe: 0,
                    no: 0,
                    pending: 0,
                  };
                  const total =
                    stats.yes + stats.maybe + stats.no + stats.pending;
                  const replied = stats.yes + stats.maybe + stats.no;
                  const progress = total
                    ? Math.round((replied / total) * 100)
                    : 0;
                  const days = Math.ceil(
                    (new Date(invite.event_at).getTime() - Date.now()) /
                      86_400_000,
                  );
                  const checklist = [
                    Boolean(invite.hero_image),
                    Boolean(invite.venue_address),
                    Boolean(invite.schedule_items?.length),
                    Boolean(invite.gallery_images?.length),
                    invite.published,
                  ];
                  return (
                    <div className={styles.dashboardSummary}>
                      <div className={styles.dashboardNumbers}>
                        <span>
                          <strong>{Math.max(0, days)}</strong> days
                        </span>
                        <span>
                          <strong>{stats.yes}</strong> attending
                        </span>
                        <span>
                          <strong>{progress}%</strong> replied
                        </span>
                      </div>
                      <div className={styles.progressTrack}>
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <p className={styles.checklist}>
                        {checklist.filter(Boolean).length}/{checklist.length}{" "}
                        launch essentials complete
                      </p>
                    </div>
                  );
                })()}
                <a
                  className={styles.cardLink}
                  href={`/i/${invite.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open public invite →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
