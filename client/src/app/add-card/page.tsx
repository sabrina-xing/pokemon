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

  const uid = session?.user?.uid;

  const uid = session?.user?.uid;

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

  const addCard = async(cardId: string) => {
    setLoading(true);
    setError(null);
    try {
    // TO DO: implement backend for this route
      const response = await fetch("http://127.0.0.1:5000/add_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: 1, card_id: cardId }), // change this to actual uid later
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
      {/* Navbar */}
      {/* <Navbar /> */}

      <h1 className="text-4xl font-bold mt-6 font-joystix">Obtain a Pokémon Card!</h1>

      <button
        onClick={getRandomCard}
        disabled={loading}
        className="mt-6 px-6 py-3 text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Fetching..." : "Get Card"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display the obtained Pokémon card */}
{isModalOpen && obtainedCard && (
        <div className="fixed inset-0 flex justify-center items-center z-50"
         style={{background:"rgb(0,0,0,0.5)"}}
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
                className="px-6 py-3 text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-900"
              >
                Add Card
              </button>

              <button
                onClick={closeModal}
                className="px-6 py-3 text-xl border-2 border-blue-600 bg-white text-blue-600 rounded-lg hover:bg-blue-200"
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

