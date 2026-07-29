import { ImageResponse } from "next/og";
import { getPublishedInviteBySlug } from "@/lib/invites";

export const alt = "Wedding invitation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invite = await getPublishedInviteBySlug(slug);
  const partnerOne = invite?.partner_one ?? "You're";
  const partnerTwo = invite?.partner_two ?? "Invited";
  const date = invite
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(invite.event_at))
    : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f5f1",
        color: "#2c2620",
        padding: "70px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8a7563",
        }}
      >
        {invite?.invite_mode === "save_the_date"
          ? "Save the date"
          : "Wedding invitation"}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 86,
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        {partnerOne} & {partnerTwo}
      </div>
      <div style={{ marginTop: 34, fontSize: 28, color: "#6f675f" }}>
        {date}
        {invite?.venue_name ? ` · ${invite.venue_name}` : ""}
      </div>
      <div
        style={{
          width: 110,
          height: 2,
          marginTop: 44,
          background: "#b79b7a",
        }}
      />
    </div>,
    size,
  );
}
