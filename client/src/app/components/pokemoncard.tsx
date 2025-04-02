interface Pokemon {
  card_id: string; // Matches database column
  pname: string; // Was "name"
  set_name: string;
  generation: string;
  rarity: string;
  pokemon_type: string; // Was "type"
  subtype: string;
  image_url: string; // Was "image"
  owner_username?: string;
}


export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className="bg-white p-2 m-2 shadow-md flex flex-col items-center text-gray-700 border-2 border-[#e9a5a3]">
      <img src={pokemon.image_url} alt={pokemon.pname} className="rounded-sm w-45 h-63 object-cover" />
      <h2 className="text-md font-bold font-joystix">{pokemon.pname}</h2>
      <p className="text-xs text-gray-500">{pokemon.pokemon_type} | {pokemon.subtype}</p>
      <p className="text-xs text-gray-500">{pokemon.card_id} | {pokemon.rarity}</p>
      <p className="text-xs text-gray-600 italic mt-1">
        Owned by: {pokemon.owner_username ?? "Unowned"}
      </p>
    </div>
  );
}
