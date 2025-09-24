import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gwent Leaderboard",
  description: "A leaderboard for Gwent players.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
