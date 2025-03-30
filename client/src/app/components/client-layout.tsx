"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideNavbar && (
        <div className="relative p-4">
          <Navbar />
        </div>
      )}
      <main>{children}</main>
    </>
  );
}
