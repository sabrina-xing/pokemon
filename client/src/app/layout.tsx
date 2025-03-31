import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./components/client-layout";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PokéPals: ",
  description: "A place to trade Pokémon cards!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased bg-cover bg-no-repeat bg-fixed min-h-screen"
        // style={{ backgroundImage: "url('/bgs/dashboard.png')" }}
        style={{ backgroundImage: "url('/bgs/pxfuel.jpg')" }}
      >
        <Providers>
          <ClientLayout>
          {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
