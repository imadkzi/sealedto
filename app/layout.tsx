import type { Metadata } from "next";
import { Fraunces, Manrope, Jost } from "next/font/google";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

/** Geometric grotesque used by the Editorial invitation template. */
const editorial = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-editorial",
});

export const metadata: Metadata = {
  title: "Sealedto — Wedding e-vites that feel personal",
  description:
    "Create animated wedding invitations, share curated guest links, and collect RSVPs in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${editorial.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
