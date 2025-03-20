interface Pokemon {
    card_id: string; // Matches database column
    pname: string; // Was "name"
    set_name: string;
    generation: string;
    rarity: string;
    pokemon_type: string; // Was "type"
    subtype: string;
    image_url: string; // Was "image"
  }
  

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
    return (
      <div className="bg-white p-2 m-2 rounded-lg shadow-md flex flex-col items-center text-black border-2 border-gray-400">
        <img src={pokemon.image_url} alt={pokemon.pname} className="rounded-sm w-45 h-63 object-cover" />
        <h2 className="text-md font-bold font-joystix">{pokemon.pname}</h2>
        <p className="text-xs">{pokemon.pokemon_type} | {pokemon.subtype}</p>
        <p className="text-xs">{pokemon.set_name} | {pokemon.rarity}</p>
      </div>
    );
  }
