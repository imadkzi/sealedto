import https from "node:https";
import { getSessionUser } from "@/lib/session";

type PhotonFeature = {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
};

function formatAddress(properties: NonNullable<PhotonFeature["properties"]>) {
  const street = [properties.housenumber, properties.street]
    .filter(Boolean)
    .join(" ");

  return [
    street,
    properties.district,
    properties.city,
    properties.state,
    properties.postcode,
    properties.country,
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
}

function isLocalTlsFailure(error: unknown) {
  if (!(error instanceof Error)) return false;
  const cause = (error as { cause?: { code?: string } }).cause;
  return (
    cause?.code === "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" ||
    cause?.code === "CERT_HAS_EXPIRED" ||
    /certificate/i.test(error.message)
  );
}

/** Fallback fetch that tolerates local/corporate TLS interception. */
function fetchPhotonInsecure(url: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: { "User-Agent": "Sealedto/1.0" },
        rejectUnauthorized: false,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          resolve(
            new Response(Buffer.concat(chunks), {
              status: response.statusCode ?? 502,
              headers: {
                "content-type":
                  response.headers["content-type"] ?? "application/json",
              },
            }),
          );
        });
      },
    );
    request.on("error", reject);
  });
}

async function fetchPhoton(query: string) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`;
  const init: RequestInit = {
    headers: { "User-Agent": "Sealedto/1.0" },
    cache: "no-store",
  };

  try {
    return await fetch(url, init);
  } catch (error) {
    const allowInsecure =
      process.env.PLACES_TLS_INSECURE === "true" ||
      process.env.NODE_ENV !== "production";

    if (!allowInsecure || !isLocalTlsFailure(error)) {
      throw error;
    }

    return fetchPhotonInsecure(url);
  }
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query || query.length < 3) {
    return Response.json({ places: [] });
  }

  try {
    const response = await fetchPhoton(query);

    if (!response.ok) {
      return Response.json(
        { error: "Venue search is temporarily unavailable" },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { features?: PhotonFeature[] };
    const places = (data.features ?? []).map(
      ({ properties = {}, geometry }, index) => ({
        id: `${index}-${properties.name ?? "place"}`,
        name: properties.name ?? query,
        address: formatAddress(properties),
        lat: geometry?.coordinates?.[1],
        lng: geometry?.coordinates?.[0],
      }),
    );

    return Response.json({ places });
  } catch {
    return Response.json(
      { error: "Venue search is temporarily unavailable" },
      { status: 502 },
    );
  }
}
