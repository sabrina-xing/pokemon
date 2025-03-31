"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import { useSession } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/signup";
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }
  
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
