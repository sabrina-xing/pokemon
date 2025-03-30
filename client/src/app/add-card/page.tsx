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
  const [obtainedCard, setObtainedCard] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const getRandomCard = async () => {

    setLoading(true);
    setError(null);
    try {
    // TO DO: implement backend for this route
      const response = await fetch(`http://127.0.0.1:5000/get_random_card`);
      if (!response.ok) throw new Error("Failed to fetch a Pokémon card.");

      const data: Pokemon = await response.json();
      setObtainedCard(data);
    } catch (err) {
      setError("Error fetching a Pokémon card.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      {obtainedCard && (
        <div className="mt-6">
          <PokemonCard pokemon={obtainedCard} />
        </div>
      )}
    </div>
  );
}
