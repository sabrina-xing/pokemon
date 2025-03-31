"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import PokemonCard from "../components/pokemoncard";

interface Pokemon {
  card_id: string;
  pname: string;
  pokemon_type: string;
  subtype: string;
  rarity: string;
  generation: string;
  set_name: string;
  image_url: string;
}

export default function AddCard() {
  const { data: session, status } = useSession();
  const [obtainedCard, setObtainedCard] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setObtainedCard(null);  // Optionally reset the card
  }

  const uid = session?.user.id
  const getRandomCard = async () => {
    if (!uid) {
      setError("User not logged in.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // TO DO: implement backend for this route
      // const uid = 1; // for testing
      const response = await fetch(`http://127.0.0.1:5000/get_random_card?uid=${uid}`);
      if (!response.ok) throw new Error("Failed to fetch a Pokémon card.");

      const data: Pokemon = await response.json();
      console.log(data)
      setObtainedCard(data);
      setIsModalOpen(true);
    } catch (err) {
      setError("Error fetching a Pokémon card.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardId: string) => {
    setLoading(true);
    setError(null);
    try {
      // TO DO: implement backend for this route
      const response = await fetch("http://127.0.0.1:5000/add_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: uid, card_id: cardId }), // change this to actual uid later
      });
      if (!response.ok) throw new Error("Failed to add a card.");
      setIsModalOpen(false);
    } catch (err) {
      setError("Error adding Pokemon Card");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div // box
        className="flex flex-col items-center transition-all duration-500 bg-white absolute z-0"
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
          ADD_CARD.TXT
        </div>
        <div className=""  // line
          style={{
            width: "99%",
            height: "3px",
            backgroundColor: "#c14540",
            marginTop: "3px",
          }}></div>
        <div className="p-16 justify-center items-center flex flex-col ">
          <h1 className="text-2xl font-bold font-joystix text-black/65">Obtain a Pokémon Card!</h1>


          <button
            onClick={getRandomCard}
            disabled={loading}
            className="mt-12 px-6 py-3 text-lg bg-[#c14540] text-white rounded-full hover:bg-[#f99987] disabled:bg-gray-400"
          >
            {loading ? "Fetching..." : "Get Card"}
          </button>

        </div>
      </div>

      {error &&
        <div className="bg-white">
          <p className="text-red-500 mt-4 rounded">{error}</p>
        </div>
      }

      {/* Display the obtained Pokémon card */}
      {isModalOpen && obtainedCard && (
        <div className="fixed inset-0 flex justify-center items-center z-50"
          style={{ background: "rgb(0,0,0,0.5)" }}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-lg font-bold text-gray-600 mr-2"
            >
              &times; {/* Close icon */}
            </button>

            <h2 className="text-2xl font-semibold text-center mb-4 text-black">You caught a {obtainedCard.pname}! </h2>

            <div className="flex justify-center">
              <PokemonCard pokemon={obtainedCard} />
            </div>

            <div className="mt-4 text-center flex justify-center space-x-4">
              <button
                onClick={() => addCard(obtainedCard?.card_id || "")}
                className="px-6 py-3 text-xl bg-[#c14540] text-white rounded-full hover:bg-[#ef6d68]"
              >
                Add Card
              </button>

              <button
                onClick={closeModal}
                className="px-6 py-3 text-xl border-2 border-[#c14540] bg-white text-[#c14540] rounded-full hover:bg-[#f6e2e0]"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

