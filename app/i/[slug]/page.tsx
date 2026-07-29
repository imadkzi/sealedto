import { notFound } from "next/navigation";
import { InviteExperience } from "@/components/InviteExperience";
import { getPublishedInviteBySlug } from "@/lib/invites";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const invite = await getPublishedInviteBySlug(slug);
  if (!invite) return {};
  const title = `${invite.partner_one} & ${invite.partner_two}`;
  return {
    title,
    description:
      invite.invite_mode === "save_the_date"
        ? `Save the date for ${title}`
        : `You're invited to the wedding of ${title}`,
  };
}

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
