"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import mainLogo from '../../../public/buttons/pokepals-logo.png';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const result = await signIn("credentials", {
        redirect: false, // Handle redirection manually
        email,
        password,
      });

      if (!result || result.error) {
        setError(result?.error ?? "Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard"); // Redirect after successful login
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      // style={{ backgroundImage: "url('/bgs/login.svg')" }}
      // style={{ backgroundImage: "url('/bgs/forest.jpg')" }}
      style={{ backgroundImage: "url('/bgs/pxfuel-day.jpg')" }}
    >
      <div className="pb-6 rounded-lg justify-center items-center flex flex-col">
        {/* Pokémon Logo */}
        <div className="flex justify-center mb-2">
          {/* <img src="/pokemonlogo.png" alt="Pokémon Logo" className="w-74 h-auto" /> */}
          <img src={mainLogo.src} alt="PokéPals Logo" className="h-26" />
        </div>

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
            }}></div>
          <div className="text-white font-joystix text-md"
            style={{
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              // font-family: "Joystix", monospace,
              textAlign: "center",
              width: "99%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}>
            LOGIN.TXT
          </div>
          <div className=""  // line
            style={{
              width: "99%",
              height: "3px",
              backgroundColor: "#c14540",
              marginTop: "3px",
            }}></div>

          <div className="p-16 justify-center items-center flex flex-col"
          style={{
            backgroundImage: "linear-gradient(#d76660, #f99987)",
            // font-family: "Joystix", monospace,
            textAlign: "center",
            width: "99%",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}>


            {/* Display error message if login fails */}
            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-8">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 focus:ring-2 focus:ring-blue-400 bg-white text-black"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 focus:ring-2 focus:ring-blue-400 bg-white text-black"
              />

              <button
                type="submit"
                className=" text-lg text-[#d76660] px-4 py-2 mt-4 rounded-full bg-white cursor-pointer"
              >
                Login
              </button>
            </form>

            {/* Signup Button */}
            <button
              onClick={() => router.push("/signup")}
              className="w-full text-white text-center px-4 py-4 rounded-lg cursor-pointer"
            >
              Signup
            </button>
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
