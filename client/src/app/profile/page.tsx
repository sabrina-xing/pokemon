"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Transaction {
  tid: number;
  card_id: string;
  sender_id: number;
  receiver_id: number;
  t_type: string;
  status: string;
}

interface Card {
  card_id: string;
  pname: string;
  image_url: string;
  set_name: string;
  rarity: string;
}

// CREATE TABLE account
//   ( 
//      uid DECIMAL(9, 0) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
//      username    VARCHAR(40), NOT NULL,
//      email    VARCHAR(255), NOT NULL,
//      usr_password    VARCHAR(255), NOT NULL,
//      bio VARCHAR(255),
//      pfp VARCHAR(255),
//   ); 

export default function ProfilePage() {
  const { data: session } = useSession();
  const uid = session?.user?.id;
  const name = session?.user?.name;
  const email = session?.user?.email;

  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [pfp, setPfp] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        // Fetch owned cards
        const cardsRes = await fetch(`http://127.0.0.1:5000/user_pokemon?uid=${uid}`);
        const cardsData = await cardsRes.json();
        setCards(cardsData);

        // // Fetch transactions
        // const txRes = await fetch(`http://127.0.0.1:5000/user_transaction?uid=${uid}`);
        // const txData = await txRes.json();
        // if (Array.isArray(txData)) {
        //   setTransactions(txData);
        // } else {
        //   setError(txData.error || "Failed to load transactions");
        // }
      } catch (err) {
        setError("Failed to load user data.");
      }
    };

    fetchData();
  }, [uid]);

  const handleUpdate = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/update_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, bio, pfp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      alert("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="pt-24 flex flex-col items-center justify-center">

      {/* Side-by-side container */}
      <div className="flex flex-col md:flex-row gap-8 px-8 justify-center items-start w-full max-w-6xl">


        <div // box
          className="flex flex-col items-center transition-all duration-500 bg-white z-0 mb-8"
          style={{
            top: "max(200px, 25vh)",
          }}
        >
          <div className=""  // line
            style={{
              width: "99%",
              height: "3px",
              backgroundColor: "#c14540",
              marginTop: "3px",
            }}></div>
          <div className="text-white font-joystix text-md"
            style={{
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              // font-family: "Joystix", monospace,
              textAlign: "center",
              width: "99%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}>
            YOUR_PROFILE.TXT
          </div>
          <div className=""  // line
            style={{
              width: "99%",
              height: "3px",
              backgroundColor: "#c14540",
              marginTop: "3px",
            }}></div>
          <div className="p-16 justify-center items-center flex flex-col">

            {/* <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Personal Info</h2> */}
            <p className="text-gray-600"><strong className="text-gray-700">Name:</strong> {name}</p>
            <p className="text-gray-600"><strong className="text-gray-700">Email:</strong> {email}</p>
            {editMode ? (
              <>
                <input
                  className="mt-2 w-full p-2 border"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <input
                  className="mt-2 w-full p-2 border"
                  placeholder="Profile Picture URL"
                  value={pfp}
                  onChange={(e) => setPfp(e.target.value)}
                />
                <button
                  onClick={handleUpdate}
                  className="mt-2 px-4 py-2 bg-[#d76660] text-white rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="mt-8 px-4 py-2 bg-[#d76660] text-white rounded-full hover:opacity-80"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>


        <div // box
          className="flex flex-col items-center transition-all duration-500 bg-white z-0 mb-8"
          style={{
            top: "max(200px, 25vh)",
          }}
        >
          <div className=""  // line
            style={{
              width: "99%",
              height: "3px",
              backgroundColor: "#c14540",
              marginTop: "3px",
            }}></div>
          <div className="text-white font-joystix text-md"
            style={{
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              // font-family: "Joystix", monospace,
              textAlign: "center",
              width: "99%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}>
            YOUR_CARDS.TXT
          </div>
          <div className=""  // line
            style={{
              width: "99%",
              height: "3px",
              backgroundColor: "#c14540",
              marginTop: "3px",
            }}></div>
          <div className="p-16 justify-center items-center flex flex-col">


            {/* <h2 className="text-md font-semibold mb-4 text-gray-500">Your Pokémon Cards</h2> */}
            {cards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-400">
                {cards.map((card) => (
                  <div key={card.card_id} className="bg-gray-200 rounded-lg p-2 text-center">
                    <img src={card.image_url} alt={card.pname} className="w-full h-32 object-contain mb-2" />
                    <p className="font-semibold">{card.pname}</p>
                    <p className="text-sm text-gray-600">{card.set_name}</p>
                    <p className="text-sm text-gray-500 italic">{card.rarity}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">No cards owned.</p>}

          </div>
        </div>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
