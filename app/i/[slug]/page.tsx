import { notFound } from "next/navigation";
import { InviteExperience } from "@/components/InviteExperience";
import { getPublishedInviteBySlug } from "@/lib/invites";

export default async function PublicInvitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invite = await getPublishedInviteBySlug(slug);
  if (!invite) notFound();

  return <InviteExperience invite={invite} mode="public" />;
}
