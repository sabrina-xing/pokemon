import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import dashboard from '../../../public/buttons/dashboard.png';
import addCard from '../../../public/buttons/add-card.png';
import giftRequest from '../../../public/buttons/gift-request.png';
import mainLogo from '../../../public/buttons/pokepals-logo.png';
import logout from '../../../public/buttons/logout.png';
import nameBg from '../../../public/buttons/name-bg.png';
import trans from '../../../public/buttons/transactions.png';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  // TO DO: redo this so it looks like the red pokeball navbar with rounded edges
  //        ^ unless i change to the tcg theme and give up on the gamified theme lol
  const { data: session, status } = useSession();
  if (status === "loading") return null; // or a loading skeleton
  if (status === "unauthenticated") return null; // or a login link
  const router = useRouter();

  // const uid = session?.user?.id;
  const name = session?.user?.name;
  // console.log("UID from session:", uid); // Debugging line
  console.log("Session data:", session); // Debugging line
  console.log("Session status:", status); // Debugging line
  return (
    <div className="fixed top-0 left-0 w-full z-50 text-white p-6 bg-transparent">
      <div className="relative flex justify-between items-center max-w-screen ">
        {/* <h1 className="text-2xl font-bold">PokéPals</h1> */}
        <img src={mainLogo.src} alt="PokéPals Logo" className="h-16" />


        <div className="flex justify-evenly font-bold">
          <a href="/dashboard">
            <Image src={dashboard} alt="Dashboard" width={200} height={40} className="hover:opacity-80 px-2 drop-shadow" />
          </a>
          <a href="/add-card">
            <Image src={addCard} alt="Add Card" width={200} height={40} className="hover:opacity-80 px-2 drop-shadow" />
          </a>
          <a href="/gift-request">
            <Image src={giftRequest} alt="Gift & Request" width={200} height={40} className="hover:opacity-80 px-2 drop-shadow" />
          </a>
          <a href="/transactions">
            <Image src={trans} alt="Trans" width={200} height={40} className="hover:opacity-80 px-2 drop-shadow" />
          </a>
          {name && (
            <a className="text-xs font-mono px-4 py-1 ml-4 hover:opacity-80 
                          text-black drop-shadow text-center flex items-center"
              style={{
                backgroundImage: `url(${nameBg.src})`,
                backgroundSize: "100% 100%",
                width: "240", height: "40",
              }}
              href="/profile"
            >
              {name}
            </a>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className=""
          >
            {/* Logout */}
            <Image src={logout} alt="Logout" width={110} height={40} className="hover:opacity-80 px-2 top-0 drop-shadow" />
          </button>
        </div>
      </div>

    </div>
  );
}
