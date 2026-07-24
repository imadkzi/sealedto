import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";
import { listInvitesForUser } from "@/lib/invites";
import styles from "@/styles/pages/Admin.module.scss";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user?.id) redirect("/login");

  const invites = await listInvitesForUser(user.id);

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
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
              Start with a template and seal your first e-vite.
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
                  <Link
                    className={styles.editLink}
                    href={`/admin/invites/${invite.id}`}
                  >
                    Edit
                  </Link>
                </div>
                <h2 className={styles.inviteTitle}>
                  <Link href={`/admin/invites/${invite.id}`}>
                    {invite.partner_one} & {invite.partner_two}
                  </Link>
                </h2>
                <p className={styles.muted}>{invite.venue_name}</p>
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
