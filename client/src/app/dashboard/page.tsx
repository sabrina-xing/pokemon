"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import PokemonCard from "../components/pokemoncard";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../lib/auth";

// Sample Pokémon Data (Replace with API Fetch Later)
const pokemonData = [
  { id: 1, name: "Pikachu", type: "Electric", rarity: "Common", image: "/pikachu.png" },
  { id: 2, name: "Charizard", type: "Fire", rarity: "Rare", image: "/charizard.png" },
  { id: 3, name: "Bulbasaur", type: "Grass", rarity: "Common", image: "/bulbasaur.png" },
  { id: 4, name: "Mewtwo", type: "Psychic", rarity: "Legendary", image: "/mewtwo.png" },
];

// export default async function Dashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return <p>You need to log in first.</p>;
//   }

//   return <h1>Welcome, {session.user?.name}!</h1>;
// }

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  // Filter Pokémon based on search & type
  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterType ? pokemon.type === filterType : true)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Search Bar & Filters */}
      <div className="max-w-4xl mx-auto p-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <select
          className="mt-4 w-full px-4 py-2 border rounded-lg"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Electric">Electric</option>
          <option value="Fire">Fire</option>
          <option value="Grass">Grass</option>
          <option value="Psychic">Psychic</option>
        </select>
      </div>

      {/* Pokémon Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">No Pokémon found.</p>
        )}
      </div>
    </div>
  );
}