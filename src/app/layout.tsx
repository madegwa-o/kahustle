import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kahustle Marketplace",
  description: "Find jobs, properties, vehicles and more in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
