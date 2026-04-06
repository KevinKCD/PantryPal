import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PantryPal",
  description: "A modern kitchen management app with dashboard, recipes, pantry, and meal planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
