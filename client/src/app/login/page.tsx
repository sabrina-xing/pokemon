"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      style={{ backgroundImage: "url('/bgs/login.svg')" }}
    >
      <div className="p-6 rounded-lg w-96">
        {/* Pokémon Logo */}
        <div className="flex justify-center mb-8">
          <img src="/pokemonlogo.png" alt="Pokémon Logo" className="w-74 h-auto" />
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold mb-8 text-center text-outline font-joystix">
          TRADING DEN
        </h2>

        {/* Display error message if login fails */}
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white text-black"
          />

          <button
            type="submit"
            className="w-full text-2xl text-white px-4 py-2 rounded-lg"
          >
            LOGIN
          </button>
        </form>

        {/* Signup Button */}
        <button
          onClick={() => router.push("/signup")}
          className="w-full text-white text-center px-4 py-1 rounded-lg mt-4"
        >
          or signup here
        </button>
      </div>
    </div>
  );
}
