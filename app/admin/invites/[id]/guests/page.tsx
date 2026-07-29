import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getInviteByIdForUser } from "@/lib/invites";
import {
  createCuratedGuest,
  createCuratedGuestsBulk,
  deleteGuest,
  listGuestsForInvite,
  rsvpCounts,
  updateCuratedGuest,
} from "@/lib/guests";
import { GuestRowActions } from "@/components/admin/GuestRowActions";
import { GuestCsvTools } from "@/components/admin/GuestCsvTools";
import styles from "@/styles/pages/Admin.module.scss";

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user?.id) redirect("/login");

  const { id } = await params;
  const invite = await getInviteByIdForUser(id, user.id);
  if (!invite) notFound();

  const [guests, counts] = await Promise.all([
    listGuestsForInvite(invite.id),
    rsvpCounts(invite.id),
  ]);

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  async function addGuest(formData: FormData) {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");
    const owned = await getInviteByIdForUser(id, sessionUser.id);
    if (!owned) redirect("/admin");

    const displayName = String(formData.get("displayName") ?? "").trim();
    if (!displayName) redirect(`/admin/invites/${id}/guests?error=invalid`);

    await createCuratedGuest(owned.id, displayName);
    redirect(`/admin/invites/${id}/guests`);
  }

  async function importGuests(formData: FormData) {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");
    const owned = await getInviteByIdForUser(id, sessionUser.id);
    if (!owned) redirect("/admin");

    const names = String(formData.get("names") ?? "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!names.length) {
      redirect(`/admin/invites/${id}/guests?error=invalid`);
    }

    await createCuratedGuestsBulk(owned.id, names);
    redirect(`/admin/invites/${id}/guests`);
  }

  async function updateGuest(formData: FormData) {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");
    const owned = await getInviteByIdForUser(id, sessionUser.id);
    if (!owned) redirect("/admin");

    const guestId = String(formData.get("guestId") ?? "").trim();
    const displayName = String(formData.get("displayName") ?? "").trim();
    if (!guestId || !displayName) {
      redirect(`/admin/invites/${id}/guests?error=invalid`);
    }

    await updateCuratedGuest(guestId, owned.id, displayName);
    redirect(`/admin/invites/${id}/guests`);
  }

  async function removeGuest(formData: FormData) {
    "use server";
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) redirect("/login");
    const owned = await getInviteByIdForUser(id, sessionUser.id);
    if (!owned) redirect("/admin");

    const guestId = String(formData.get("guestId") ?? "").trim();
    if (!guestId) redirect(`/admin/invites/${id}/guests?error=invalid`);

    await deleteGuest(guestId, owned.id);
    redirect(`/admin/invites/${id}/guests`);
  }

  return (
    <div className={styles.shell}>
      <div className={`${styles.wrap} ${styles.wrapWide}`}>
        <header className={styles.header}>
          <Link href={`/admin/invites/${invite.id}`} className={styles.brand}>
            ← Invite
          </Link>
        </header>

        <div className={styles.pageHead}>
          <h1 className={styles.title}>Guests</h1>
          <p className={styles.muted}>
            {invite.partner_one} & {invite.partner_two}
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

        <div className={styles.guestLayout}>
          <div className={styles.guestTools}>
            <form action={addGuest} className={styles.form}>
              <h2 className={styles.inviteTitle}>Add curated guest</h2>
              <p className={styles.muted}>
                Creates a personal link that greets them by name.
              </p>
              <label className={styles.label}>
                Guest name
                <input className={styles.input} name="displayName" required />
              </label>
              <button className={styles.button} type="submit">
                Add guest
              </button>
            </form>

            <GuestCsvTools
              inviteId={invite.id}
              origin={origin}
              importAction={importGuests}
              guests={guests.map((guest) => ({
                display_name: guest.display_name,
                rsvp_status: guest.rsvp_status,
                party_size: guest.party_size,
                rsvp_note: guest.rsvp_note,
                is_curated: guest.is_curated,
                token: guest.token,
              }))}
            />
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Party</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No guests yet.</td>
                  </tr>
                ) : (
                  guests.map((guest) => (
                    <GuestRowActions
                      key={guest.id}
                      guest={{
                        id: guest.id,
                        display_name: guest.display_name,
                        is_curated: guest.is_curated,
                        rsvp_status: guest.rsvp_status,
                        party_size: guest.party_size,
                        personalUrl: guest.is_curated
                          ? `${origin}/g/${guest.token}`
                          : undefined,
                      }}
                      updateAction={updateGuest}
                      deleteAction={removeGuest}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
