interface Pokemon {
    id: number;
    name: string;
    type: string;
    rarity: string;
    image: string;
}

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 object-cover" />
            <h2 className="text-lg font-bold">{pokemon.name}</h2>
            <p className="text-sm text-gray-600">{pokemon.type} | {pokemon.rarity}</p>
        </div>
    );
}
