import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmLife RPG",
  description: "A text-based farm life RPG game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
