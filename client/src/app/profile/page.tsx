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
  const { data: session, update } = useSession()
  const uid = session?.user?.id;
  const name = session?.user?.name;
  const email = session?.user?.email;
  console.log("Session data:", session);

  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bio, setBio] = useState(session?.user?.bio || "");
  const [pfp, setPfp] = useState(session?.user?.pfp || "");
  const [editMode, setEditMode] = useState(false);
  console.log(bio, pfp);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        // Fetch owned cards
        const cardsRes = await fetch(`http://127.0.0.1:5000/user_pokemon?uid=${uid}`);
        const cardsData = await cardsRes.json();
        setCards(cardsData);
      } catch (err) {
        setError("Failed to load user data.");
      }
    };

    fetchData();
  }, [uid]);

  const filteredCards = cards.filter((card) =>
    card.pname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/update_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, bio, pfp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      // console.log("new data", bio, pfp);
      // // Update the session with new bio and pfp
      // await update({
      //   user: {
      //     bio: bio,
      //     pfp: pfp,
      //   }
      // }); 
      // console.log("new session", session);

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
          <div className="p-16 flex flex-col">
            {pfp ? (
              <img
                src={pfp}
                alt="Profile Picture"
                className="mb-8 w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-md"
              />) :
              (
                <></>
              )
            }
            <p className="text-gray-600"><strong className="text-gray-700">Name:</strong> {name}</p>
            <p className="text-gray-600"><strong className="text-gray-700">Email:</strong> {email}</p>
            {editMode ? (
              <>
                <input
                  className="mt-2 w-full p-2 border-2 border-gray-300 rounded-full text-gray-700"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <input
                  className="mt-2 w-full p-2 border-2 border-gray-300 rounded-full text-gray-700"
                  placeholder="Profile Picture URL"
                  value={pfp}
                  onChange={(e) => setPfp(e.target.value)}
                />
                <button
                  onClick={handleUpdate}
                  className="mt-2 px-4 py-2 bg-[#d76660] text-white rounded-full"
                >
                  Save
                </button>
              </>
            ) : (
              <>

                <p className="text-gray-600"><strong className="text-gray-700">Bio: </strong>{bio}</p>
                {pfp ? (<></>) :
                  (
                    <p className="text-gray-600">
                      <strong className="text-gray-700">Profile Picture:</strong> {pfp || "N/A"} </p>
                  )
                }
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-8 px-4 py-2 bg-[#d76660] text-white rounded-full hover:opacity-80"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          {/* Searchbar */}
          {/* <div className="w-full pb-4"
            // className="w-full py-6 px-2 text-gray-700 rounded-lg text-sm shadow-md 
            //       bg-[#F4E094] border-2 border-[#60606F]"
            style={{
              // padding: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                // width: "35vw",
                backgroundColor: "white",
                borderTopRightRadius: "10px",
                borderTopLeftRadius: "10px",
                padding: "20px",
                paddingLeft: "30px",
                paddingBottom: "10px",
              }}
            >
              <h1 className="text-lg font-bold ml-2 text-[#b13730]">Pokémon Search</h1>
            </div>
            <div className="p-16 justify-center items-center flex flex-col"
              style={{
                display: "flex",
                // width: "35vw",
                backgroundImage: "linear-gradient(#d76660, #f99987)",
                // borderBottomRightRadius: "10px",
                // borderBottomLeftRadius: "10px",
                padding: "20px",
                paddingLeft: "30px",
                // minHeight: "300px",
                boxShadow: "inset 0 0 0 6px white",
              }}>
              <input
                type="text"
                placeholder="Search by Pokémon name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded-full bg-white text-gray-700"
              />
            </div>
          </div> */}

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
            <div className="p-8 justify-center items-center flex flex-col">

              <input
                type="text"
                placeholder="Search by Pokémon name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border-2 mb-6 border-gray-400 rounded-full bg-white text-gray-700"
              />

              {/* <h2 className="text-md font-semibold mb-4 text-gray-500">Your Pokémon Cards</h2> */}
              {filteredCards.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-700">
                  {filteredCards.map((card) => (
                    <div key={card.card_id} className="bg-gray-100 p-2 text-center">
                      <img src={card.image_url} alt={card.pname} className="w-full h-42 object-contain mb-2" />
                      <p className="font-semibold">{card.pname}</p>
                      <p className="text-sm text-gray-600">{card.set_name}</p>
                      <p className="text-sm text-gray-500 italic">{card.rarity}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-600">No Pokémon match your search.</p>}

            </div>
          </div>
        </div>
      </div>

      {error && <>
        {/* Display messages */}
        < div className="bg-white py-2 p-4 mb-8 items-center justify-center flex flex-col"
          style={{
            borderRadius: "10px",
            //   backgroundImage: "linear-gradient(#d76660, #f99987)",
          }}
        >
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      </>
      }
    </div >
  );
}
