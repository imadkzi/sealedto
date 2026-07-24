import { notFound } from "next/navigation";
import { InviteExperience } from "@/components/InviteExperience";
import { getGuestByToken } from "@/lib/guests";
import { getInviteById } from "@/lib/invites";

export default async function CuratedInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest?.is_curated) notFound();

  const invite = await getInviteById(guest.invite_id);
  if (!invite?.published) notFound();

  return <InviteExperience invite={invite} guest={guest} mode="curated" />;
}
