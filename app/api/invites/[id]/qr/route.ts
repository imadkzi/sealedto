import QRCode from "qrcode";
import { getSessionUser } from "@/lib/session";
import { getInviteByIdForUser } from "@/lib/invites";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const invite = await getInviteByIdForUser(id, user.id);
  if (!invite) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const svg = await QRCode.toString(`${origin}/i/${invite.slug}`, {
    type: "svg",
    margin: 1,
    width: 640,
    color: { dark: "#1c1714", light: "#ffffff" },
  });

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "content-disposition": `inline; filename="invite-${invite.slug}-qr.svg"`,
      "cache-control": "private, max-age=300",
    },
  });
}
