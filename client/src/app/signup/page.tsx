"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import mainLogo from '../../../public/buttons/pokepals-logo.png';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Signup failed.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bgs/pxfuel-day.jpg')" }}
    >
      <div className="pb-6 rounded-lg justify-center items-center flex flex-col max-w-[59%]">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img src={mainLogo.src} alt="PokéPals Logo" className="h-26" />
        </div>
        <div className="flex flex-col items-center transition-all duration-500 bg-white z-0"
          style={{ top: "max(200px, 25vh)" }}>
          <div style={{ width: "99%", height: "3px", backgroundColor: "#c14540", marginTop: "3px" }} />
          <div className="text-white font-joystix text-md"
            style={{
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              textAlign: "center",
              width: "99%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}>
            SIGNUP.TXT
          </div>
          <div style={{ width: "99%", height: "3px", backgroundColor: "#c14540", marginTop: "3px" }} />

          <div className="p-16 justify-center items-center flex flex-col"
            style={{
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              textAlign: "center",
              width: "99%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}>

            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 pt-8">
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white text-black"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white text-black"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white text-black"
              />

              <button
                type="submit"
                className="text-lg text-[#d76660] px-4 py-2 mt-4 rounded-full bg-white cursor-pointer"
              >
                Signup
              </button>
            </form>

            <button
              onClick={() => router.push("/login")}
              className="w-full text-white text-center px-4 py-4 rounded-lg cursor-pointer"
            >
              Login
            </button>
          </div>
          <div style={{ width: "99%", height: "3px", backgroundColor: "#c14540", marginBottom: "3px" }} />
        </div>
      </div>
    </div>
  );
}
