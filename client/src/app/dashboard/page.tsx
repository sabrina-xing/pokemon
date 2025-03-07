import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../lib/auth";


export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   return <p>You need to log in first.</p>;
  // }
  return <h1>dashboard here</h1>;
  // return <h1>Welcome, {session.user?.name}!</h1>;
}
