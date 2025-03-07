import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="bg-blue-500 text-white p-4 shadow-md">
//       <div className="max-w-6xl mx-auto flex justify-between">
//         <h1 className="text-xl font-bold">Pokémon Trading</h1>
//         <div className="flex space-x-4">
//           <Link href="/upload" className="hover:text-gray-300">Upload</Link>
//           <Link href="/trade" className="hover:text-gray-300">Trade</Link>
//           <Link href="/discuss" className="hover:text-gray-300">Discuss</Link>
//         </div>
//       </div>
//     </nav>
//   );
// }
export default function Navbar() {
  // TO DO: redo this so it looks like the red pokeball navbar with rounded edges
  //        ^ unless i change to the tcg theme and give up on the gamified theme lol
  return (
    <div className="text-white p-4 relative mx-4 z-99">
      <div
        className="absolute inset-0 bg-blue-400 border-2"
        style={{
          clipPath: "polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)",
        }}
      ></div>
      <div className="relative flex justify-between items-center max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold">Trading Den</h1>

        <div className="flex w-1/2 justify-evenly font-bold">
          <a href="/upload" className="hover:text-gray-300">UPLOAD</a>
          <a href="/trade" className="hover:text-gray-300">TRADE</a>
          <a href="/discuss" className="hover:text-gray-300">DISCUSS</a>
        </div>
      </div>

    </div>
  );
}
