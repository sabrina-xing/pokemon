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

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
    //   { id: 1, name: "Pikachu", type: "Electric", subtype: "Common", rarity: "Rare 1", 
    //      generation: "Gen 1", set_name: "Set 1", image: "/pikachu.png" },
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-black border-2 border-gray-400">
            <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 object-cover" />
            <h2 className="text-md font-bold font-joystix">{pokemon.name}</h2>
            <p className="text-xs">{pokemon.type} | {pokemon.subtype}</p>
            <p className="text-xs">{pokemon.set_name} | {pokemon.rarity}</p>
        </div>
    );
}
