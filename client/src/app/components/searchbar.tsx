"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
interface SearchBarProps {
  onSearch: (queryParams: string) => void;
}
type Option = {
  value: string;
  label: string;
  image: string;
}
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState({
    pname: "",
    card_id: "",
    set_name: "",
    generation: "",
    rarity: "",
    pokemon_type: "",
    subtype: "",
  });

  const setOptions = [ 
    { value: "", label: "All Sets" },
    { value: "Base", label: "Base" },
    { value: "Jungle", label: "Jungle" },
    { value: "Wizards", label: "Wizards" },
    { value: "Fossil", label: "Fossil" },
    { value: "Base Set 2", label: "Base Set 2" },
    { value: "Team Rocket", label: "Team Rocket" },
    { value: "Neo Genesis", label: "Neo Genesis" },
    { value: "Neo Discovery", label: "Neo Discovery" },
    { value: "Neo Revelation", label: "Neo Revelation" },
    { value: "Neo Destiny", label: "Neo Destiny" },
    { value: "Legendary Collection", label: "Legendary Collection" },
    { value: "Best of Game", label: "Best of Game" },
    { value: "Diamond & Pearl", label: "Diamond & Pearl" },
    { value: "Mysterious Treasures", label: "Mysterious Treasures" },
    { value: "POP Series 6", label: "POP Series 6" },
    { value: "Secret Wonders", label: "Secret Wonders" },
    { value: "Great Encounters", label: "Great Encounters" },
    { value: "Majestic Dawn", label: "Majestic Dawn" },
    { value: "Legends Awakened", label: "Legends Awakened" },
    { value: "Stormfront", label: "Stormfront" },
    { value: "Platinum", label: "Platinum" },
    { value: "Supreme Victors", label: "Supreme Victors" },
    { value: "Arceus", label: "Arceus" },
    { value: "Evolutions", label: "Evolutions" },
    { value: "Celebrations", label: "Celebrations" }
  ];

  const typeOptions: Option[]  = [
    { value: "", label: "All Types", image: "types/star.png" },
    { value: "['Colorless']", label: "Normal", image: "types/normal.png" },
    { value: "['Lightning']", label: "Electric", image: "types/electric.png"},
    { value: "['Fire']", label: "Fire", image: "types/fire.png" },
    { value: "['Water']", label: "Water", image: "types/water.png" },
    { value: "['Fighting']", label: "Fighting", image: "types/fighting.png"},
    { value: "['Psychic']", label: "Psychic", image: "types/psychic.png"},
    { value: "['Grass']", label: "Grass", image: "types/grass.png"},
    { value: "['Metal']", label: "Steel", image: "types/steel.png"},
    { value: "['Darkness']", label: "Dark", image: "types/dark.png"}
  ];
  
  
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

    <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-[#F8F8CD] border-2 border-gray-300 shadow-md">
      {/* Search Input */}
      <input
        type="text"
        name="pname"
        placeholder="Search Pokémon"
        value={searchParams.pname}
        onChange={handleChange}
        className="w-full mt-2 px-4 py-2 border rounded-lg bg-white"
      />

      {/* Card ID Search */}
      <input
        type="text"
        name="card_id"
        placeholder="Search Card ID"
        value={searchParams.card_id}
        onChange={handleChange}
        className="w-full mt-2 px-4 py-2 border rounded-lg bg-white"
      />
      {/* Filters */}
      <select name="set_name" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        {...setOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      </select>

      <select name="generation" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Generations</option>
        <option value="Base">Base</option>
        <option value="Neo">Neo</option>
        <option value="Diamond & Pearl">Diamond & Pearl</option>
        <option value="POP">POP</option>
        <option value="Platinum">Platinum</option>
        <option value="XY">XY</option>
        <option value="Sword & Shield">Sword & Shield</option>
        <option value="Other">Other</option>
      </select>

      <select name="rarity" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Rarities</option>
        <option value="Common">Common</option>
        <option value="Uncommon">Uncommon</option>
        <option value="Rare">Rare</option>
        <option value="Rare Holo">Rare Holo</option>
        <option value="Rare Shining">Rare Shining</option>
        <option value="Promo">Promo</option>
        <option value="Classic Collection">Classic Collection</option>
      </select>

      <select name="pokemon_type" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        {...typeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      </select>

     {/* <Select options={typeOptions}
        name="type"
        isMulti
        placeholder="Select Type(s)"
        components={{
          IndicatorSeparator: () => null
        }}
        formatOptionLabel={ option => (
          <div className="flex items-center space-x-2">
            <img src={option.image} alt={option.label} className="w-5 h-5" />
            <span>{option.label}</span>
          </div>
       )}
        styles={{
          control: (base) => ({
          ...base,
          marginTop: "0.5rem",
          border: "1px solid black",
          borderRadius: "0.5rem",
          paddingInline: "0.5rem",
        }),
      }}
      ></Select>*/}


      <select name="subtype" className="w-full mt-2 px-4 py-2 border rounded-lg bg-white" onChange={handleChange}>
        <option value="">All Evolutions</option>
        <option value="['Basic']">Basic</option>
        <option value="['Stage 1']">Stage 1</option>
        <option value="['Stage 2']">Stage 2</option>
      </select>
    </div>
  );
}
