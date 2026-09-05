import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Manrope, Prata } from "next/font/google";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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

/** Display serif for Editorial couple names and section titles. */
const editorialDisplay = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-editorial-display",
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
      className={`${display.variable} ${body.variable} ${editorial.variable} ${editorialDisplay.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
