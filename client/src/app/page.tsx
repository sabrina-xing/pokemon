import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login"); // Redirect to login page if not authenticated
  }

  return redirect("/dashboard"); // Redirect to dashboard if authenticated
}
