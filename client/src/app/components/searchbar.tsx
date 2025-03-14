"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (queryParams: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState({
    pname: "",
    set_name: "",
    generation: "",
    rarity: "",
    pokemon_type: "",
    subtype: "",
  });

  // Update search state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Build query string and fetch Pokémon when search params change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const queryString = new URLSearchParams(
        Object.entries(searchParams).filter(([_, value]) => value.trim())
      ).toString();

      onSearch(queryString ? `?${queryString}` : "");
    }, 300); // Debounce time

    return () => clearTimeout(delayDebounce);
  }, [searchParams, onSearch]);

  return (
    <div className="w-full p-4 rounded-lg bg-[#F8F8CD] border-2 border-gray-300 shadow-md">
      {/* Search Input */}
      <input
        type="text"
        name="pname"
        placeholder="Search Pokémon..."
        value={searchParams.pname}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg bg-white"
      />

      {/* Filters */}
      <select name="set_name" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Sets</option>
        <option value="Set 1">Set 1</option>
        <option value="Set 2">Set 2</option>
      </select>

      <select name="generation" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Generations</option>
        <option value="Gen 1">Gen 1</option>
        <option value="Gen 2">Gen 2</option>
      </select>

      <select name="rarity" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Rarities</option>
        <option value="Rare 1">Rare 1</option>
        <option value="Rare 2">Rare 2</option>
      </select>

      <select name="pokemon_type" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Types</option>
        <option value="Electric">Electric</option>
        <option value="Fire">Fire</option>
        <option value="Grass">Grass</option>
      </select>

      <select name="subtype" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Subtypes</option>
        <option value="Common">Common</option>
        <option value="Rare">Rare</option>
      </select>
    </div>
  );
}
