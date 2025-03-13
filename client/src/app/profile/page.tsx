"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  name: string;
  bio: string;
  profile_pic: string;
}

interface PokemonCard {
  id: number;
  name: string;
  type: string;
  rarity: string;
  image: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setCards(data.cards);
        } else {
          console.error("Error fetching profile:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Section */}
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <img
            src={user.profile_pic || "/default-avatar.png"}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full border"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Profile not found.</p>
      )}

      {/* Owned Cards Section */}
      <h3 className="text-xl font-bold mt-6">Your Pokémon Cards</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="bg-white shadow-md rounded-lg p-4">
              <img src={card.image} alt={card.name} className="w-full h-32 object-cover rounded" />
              <h4 className="text-lg font-bold mt-2">{card.name}</h4>
              <p className="text-sm text-gray-600">{card.type} - {card.rarity}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No Pokémon cards owned.</p>
        )}
      </div>
    </div>
  );
}
