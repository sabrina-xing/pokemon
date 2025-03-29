import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "PokéPals",
  description: "A place to trade Pokémon cards!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased"
        style={{ backgroundImage: "url('/bgs/dashboard.png')" }}>
        <div className="relative p-4">
          <Navbar />
        </div>
        <main>{children}</main>
      </body>
    </html >
  );
}
