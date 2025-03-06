import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-500 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between">
        <h1 className="text-xl font-bold">Pokémon Trading</h1>
        <div className="flex space-x-4">
          <Link href="/upload" className="hover:text-gray-300">Upload</Link>
          <Link href="/trade" className="hover:text-gray-300">Trade</Link>
          <Link href="/discuss" className="hover:text-gray-300">Discuss</Link>
        </div>
      </div>
    </nav>
  );
}
