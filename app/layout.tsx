import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "@/styles/globals.scss";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
