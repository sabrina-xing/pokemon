"use client";

import { useState, useEffect, useCallback } from "react";
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
  owner_username?: string;
}

const POKEMON_PER_PAGE = 12;

export default function Dashboard() {
  const [pokemonCards, setPokemonCards] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

      if (!response.ok) throw new Error("No Pokémon cards found");

      const data: Pokemon[] = await response.json();

      if (!data.length) {
        setError("No Pokémon cards found");
        throw new Error("No Pokemon cards found");

      }
      setPokemonCards(data);
      setTotalPages(Math.ceil(data.length / POKEMON_PER_PAGE)); // Calculate total pages
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);  // Set the error message
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Pokémon only once when component mounts
  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  // Get Pokémon for the current page
  const indexOfLastPokemon = currentPage * POKEMON_PER_PAGE;
  const indexOfFirstPokemon = indexOfLastPokemon - POKEMON_PER_PAGE;
  const currentPokemon = pokemonCards.slice(indexOfFirstPokemon, indexOfLastPokemon);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
    >
      {/* Search Bar & Filters */}
      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6"
      >
        {/* Left Sidebar: Search & Filters */}
        <div className="w-full"
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
            }}
          >
            <h1 className="text-lg font-bold ml-2 text-[#b13730]">Pokémon Search</h1>
          </div>
          <div className="p-16 justify-center items-center flex flex-col"
            style={{
              display: "flex",
              // width: "35vw",
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              borderBottomRightRadius: "10px",
              borderBottomLeftRadius: "10px",
              padding: "20px",
              paddingLeft: "30px",
              // minHeight: "300px",
              boxShadow: "inset 0 0 0 6px white",
            }}>
            <SearchBar onSearch={fetchPokemon} />
          </div>
        </div>

        {/* Right Section: Pokémon Cards Grid */}
        <div // box
          className="flex flex-col items-center transition-all duration-500 bg-white z-0"
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
            }}>

          </div>
          <div className="text-white font-joystix text-md"
            style={{
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              // backgroundImage: "linear-gradient(#F4E194, #F8F8CD)",
              // font-family: "Joystix", monospace,
              // textAlign: "center",
              paddingLeft: "30px",
              width: "99%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}>
            RESULTS
          </div>
          <div className=""  // line
            style={{
              width: "99%",
              height: "3px",
              backgroundColor: "#c14540",
              marginTop: "3px",
            }}></div>


          <div
            // className="w-full py-6 px-2 bg-[#F4E094] border-2 border-[#60606F] rounded-lg shadow-md"
            style={{              
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              // backgroundImage: "linear-gradient(#F4E194, #F8F8CD)",
              // font-family: "Joystix", monospace,
              textAlign: "center",
              width: "99%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            {/* <h1 className="text-lg font-bold ml-2 mb-2 text-[#784426]">RESULTS</h1> */}
            <div
              className="py-8 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full justify-center items-center"
            >

              {loading ? (
                <p className="text-center text-white">Loading Pokémon...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : currentPokemon.length > 0 ? (
                currentPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.card_id} pokemon={pokemon} />
                ))
              ) : (
                <p className="text-center text-white col-span-full">No Pokémon found.</p>
              )}


            </div>
            {/* Pagination Controls */}
            <div className="w-full flex justify-center">
              {totalPages > 1 && (
                <div className="flex justify-center mb-4 space-x-4 text-sm">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-gray-700 rounded-full ${currentPage === 1 ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                  >
                    ← Previous
                  </button>
                  <span className="text-white py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-gray-700 rounded-full ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className=""  // line
            style={{
              width: "99%",
              height: "3px",
              backgroundColor: "#c14540",
              marginBottom: "3px",
            }}></div>
        </div>
      </div>
    </div>
  );
}