import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  // TO DO: redo this so it looks like the red pokeball navbar with rounded edges
  //        ^ unless i change to the tcg theme and give up on the gamified theme lol
  const { data: session, status } = useSession();
  if (status === "loading") return null; // or a loading skeleton
  if (status === "unauthenticated") return null; // or a login link

  // const uid = session?.user?.id;
  const name = session?.user?.name;
  // console.log("UID from session:", uid); // Debugging line
  console.log("Session data:", session); // Debugging line
  console.log("Session status:", status); // Debugging line
  return (
    <div className="text-white p-4 relative mx-4 z-99">
      <div
        className="absolute inset-0 bg-blue-400 border-2"
        style={{
          clipPath: "polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)",
        }}
      ></div>
      <div className="relative flex justify-between items-center max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold">PokéPals</h1>

        <div className="flex w-6/7 justify-evenly font-bold">
          <a
            href="/dashboard"
            className="bg-gradient-to-b from-white to-[#F0A850] bg-clip-text text-transparent hover:opacity-80 fix-stroke drop-shadow-[0_0_2px_black]"
          >
            TRADING DASHBOARD
          </a>

          <a
            href="/add-card"
            className="bg-gradient-to-b from-white to-[#F0A850] bg-clip-text text-transparent hover:opacity-80 drop-shadow-[0_0_2px_black]"
          >
            ADD CARD
          </a>

          <a
            href="/gift-request"
            className="bg-gradient-to-b from-white to-[#F0A850] bg-clip-text text-transparent hover:opacity-80 drop-shadow-[0_0_2px_black]"
          >
            GIFT & REQUEST
          </a>

          {/* <a href="/profile" className="hover:text-gray-300">PROFILE</a> */}
          {/* Right: UID Display */}
          {name && (
            <div className="ml-6 text-sm font-mono bg-white text-blue-600 px-3 py-1 rounded-full border-2 border-blue-700 drop-shadow">
              Hello, {name}
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold border border-red-800"
          >
            Logout
          </button>
        </div>
      </div>

    </div>
  );
}
