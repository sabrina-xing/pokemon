"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/navbar";
import PokemonCard from "../components/pokemoncard";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../lib/auth";
import SearchBar from "../components/searchbar";

const pokemonData = [
  { id: 1, name: "Pikachu", type: "Electric", subtype: "Common", rarity: "Rare 1", generation: "Gen 1", set_name: "Set 1", image: "/pikachu.png" },
  { id: 2, name: "Charizard", type: "Fire", subtype: "Rare", rarity: "Rare 2", generation: "Gen 2", set_name: "Set 2", image: "/charizard.png" },
  { id: 3, name: "Bulbasaur", type: "Grass", subtype: "Common", rarity: "Rare 3", generation: "Gen 3", set_name: "Set 3", image: "/bulbasaur.png" },
  { id: 4, name: "Mewtwo", type: "Psychic", subtype: "Legendary", rarity: "Rare 4", generation: "Gen 4", set_name: "Set 4", image: "/mewtwo.png" },
];

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

export default function Dashboard() {
  const [pokemonCards, setPokemonCards] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  // Filter Pokémon based on search & type
  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterType ? pokemon.type === filterType : true)
  );

  const fetchPokemon = useCallback(async (queryParams = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/search_pokemon${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch Pokémon cards.");

      const data: Pokemon[] = await response.json();
      setPokemonCards(data);
    } catch (err) {
      setError("Error fetching Pokémon cards.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Pokémon only once when component mounts
  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center"
      // className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bgs/dashboard.png')" }}
    >
      {/* Navbar */}
      <div className="relative p-4">
        <Navbar />
      </div>

      {/* Search Bar & Filters */}
      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* Left Sidebar: Search & Filters */}
        <div className="w-1/4 py-8 px-2 text-black rounded-lg text-sm shadow-md bg-[#F4E094] border-2 border-[#60606F]">
          {/* <SearchBar onResults={setPokemonCards} /> */}
          <SearchBar onSearch={fetchPokemon} />
        </div>

        {/* Right Section: Pokémon Cards Grid */}
        <div className="w-3/4 py-8 px-2 bg-[#F4E094] border-2 border-[#60606F] rounded-lg shadow-md">
          <div className="bg-[#F8F8CD] py-8 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {loading ? (
              <p className="text-center text-black">Loading Pokémon...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : pokemonCards.length > 0 ? (
              pokemonCards.map((pokemon) => (
                <PokemonCard key={pokemon.card_id} pokemon={pokemon} />
              ))
            ) : (
              <p className="text-center text-black col-span-full">No Pokémon found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}