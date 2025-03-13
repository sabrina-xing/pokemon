"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password || !confirmPassword) {
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
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Signup failed.");
                return;
            }

            console.log("✅ User Created:", data);
            router.push("/login");
        } catch (err) {
            setError("Something went wrong.");
        }

        console.log("✅ Signup Successful:", { email, password });

        // Simulate signup (replace with API request)
        router.push("/dashboard");
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/bgs/login.png')" }}
        >
            <div className="p-6 rounded-lg w-96">
                <div className="flex justify-center mb-8">
                    <img src="/pokemonlogo.png" alt="Pokémon Logo" className="w-74 h-auto" />
                </div>
                <h2 className="text-4xl font-bold mb-8 text-center text-outline font-joystix">
                    TRADING DEN
                </h2>

                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

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

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white text-black"
                    />

                    <button
                        type="submit"
                        className="w-full text-white text-xl px-4 py-2 rounded-lg"
                    >
                        SIGN UP
                    </button>
                </form>

                <button
                    onClick={() => router.push("/login")}
                    className="w-full text-white px-4 py-1 rounded-lg mt-4"
                >
                    or login here
                </button>
            </div>
        </div>
    );
}
