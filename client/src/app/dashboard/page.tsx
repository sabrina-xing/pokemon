"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import PokemonCard from "../components/pokemoncard";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../lib/auth";
import SearchBar from "../components/searchbar";

// Sample Pokémon Data (Replace with API Fetch Later)
// pname, set_name, type, and subtype, generation
// const pokemonData = [
//   { id: 1, name: "Pikachu", type: "Electric", rarity: "Common", image: "/pikachu.png" },
//   { id: 2, name: "Charizard", type: "Fire", rarity: "Rare", image: "/charizard.png" },
//   { id: 3, name: "Bulbasaur", type: "Grass", rarity: "Common", image: "/bulbasaur.png" },
//   { id: 4, name: "Mewtwo", type: "Psychic", rarity: "Legendary", image: "/mewtwo.png" },
// ];
const pokemonData = [
  { id: 1, name: "Pikachu", type: "Electric", subtype: "Common", rarity: "Rare 1", generation: "Gen 1", set_name: "Set 1", image: "/pikachu.png" },
  { id: 2, name: "Charizard", type: "Fire", subtype: "Rare", rarity: "Rare 2", generation: "Gen 2", set_name: "Set 2",image: "/charizard.png" },
  { id: 3, name: "Bulbasaur", type: "Grass", subtype: "Common", rarity: "Rare 3", generation: "Gen 3", set_name: "Set 3",image: "/bulbasaur.png" },
  { id: 4, name: "Mewtwo", type: "Psychic", subtype: "Legendary", rarity: "Rare 4", generation: "Gen 4", set_name: "Set 4",image: "/mewtwo.png" },
];

// export default async function Dashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return <p>You need to log in first.</p>;
//   }

//   return <h1>Welcome, {session.user?.name}!</h1>;
// }

interface Pokemon {
  id: number;
  name: string;
  type: string;
  subtype: string;
  rarity: string;
  generation: string;
  set_name: string;
  image: string;
}

export default function Dashboard() {
  const [pokemonCards, setPokemonCards] = useState<Pokemon[]>([])

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  // Filter Pokémon based on search & type
  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterType ? pokemon.type === filterType : true)
  );

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
        {/* <div className="w-1/4 py-8 px-2 text-black rounded-lg text-sm shadow-md bg-[#F4E094] border-2 border-[#60606F]">
          <div className="bg-[#F8F8CD] py-8 px-2 ">
            <input
              type="text"
              placeholder="Search Pokémon by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg bg-white" // focus:ring-2
            /> */}

            {/* type filter */}
            {/* <select
              className="mt-4 w-full px-4 py-2 border-2 rounded-lg bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Electric">Electric</option>
              <option value="Fire">Fire</option>
              <option value="Grass">Grass</option>
              <option value="Psychic">Psychic</option>
            </select> */}

            {/* TO DO: subtype */}
            {/* <select
              className="mt-4 w-full px-4 py-2 border-2 rounded-lg bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Subtypes</option>
              <option value="Electric">Electric</option>
              <option value="Fire">Fire</option>
              <option value="Grass">Grass</option>
              <option value="Psychic">Psychic</option>
            </select> */}

            {/* TO DO: subtype */}
            {/* <select
              className="mt-4 w-full px-4 py-2 border-2 rounded-lg bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Rarities</option>
              <option value="Electric">Electric</option>
              <option value="Fire">Fire</option>
              <option value="Grass">Grass</option>
              <option value="Psychic">Psychic</option>
            </select> */}
            {/* TO DO: add drop downs for:
              rarity 
              name: string;
              type: string;
              subtype: string;
              rarity: string;
              generation: string;
              set_name */}
          {/* </div>
        </div> */}
         <div className="w-1/4 py-8 px-2 text-black rounded-lg text-sm shadow-md bg-[#F4E094] border-2 border-[#60606F]">
          <SearchBar onResults={setPokemonCards} />
        </div>

        {/* Right Section: Pokémon Cards Grid */}
        <div className="w-3/4 
         py-8 px-2 bg-[#F4E094] border-2 border-[#60606F] rounded-lg shadow-md">
          <div className="bg-[#F8F8CD] py-8 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredPokemon.length > 0 ? (
              filteredPokemon.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)
            ) : (
              <p className="text-center text-black col-span-full">No Pokémon found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}