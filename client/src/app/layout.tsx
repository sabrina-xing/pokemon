// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "./components/navbar";

// export const metadata: Metadata = {
//   title: "PokéPals",
//   description: "A place to trade Pokémon cards!",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className="font-sans antialiased"
//         style={{ backgroundImage: "url('/bgs/dashboard.png')" }}>
//         <div className="relative p-4">
//           <Navbar />
//         </div>
//         <main>{children}</main>
//       </body>
//     </html >
//   );
// }

// app/layout.tsx or app/RootLayout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "./components/navbar";
// import { usePathname } from "next/navigation";
// import { ReactNode } from "react";

// export const metadata: Metadata = {
//   title: "PokéPals",
//   description: "A place to trade Pokémon cards!",
// };

// // Wrap RootLayout in a client component to use hooks
// export default function RootLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="font-sans antialiased" style={{ backgroundImage: "url('/bgs/dashboard.png')" }}>
//         <BodyWithNavbar>{children}</BodyWithNavbar>
//       </body>
//     </html>
//   );
// }

// // 👇 this is now a client component so we can use usePathname()
// function BodyWithNavbar({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const hideNavbar = pathname === "/login" || pathname === "/signup";

//   return (
//     <>
//       {!hideNavbar && (
//         <div className="relative p-4">
//           <Navbar />
//         </div>
//       )}
//       <main>{children}</main>
//     </>
//   );
// }

// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./components/client-layout";

export const metadata: Metadata = {
  title: "PokéPals",
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
        className="font-sans antialiased"
        style={{ backgroundImage: "url('/bgs/dashboard.png')" }}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
