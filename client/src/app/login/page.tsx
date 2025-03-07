"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const result = await signIn("credentials", {
    //   redirect: false,
    //   email,
    //   password,
    // });

    // if (result?.error) {
    //   setError(result.error);
    // } else {
    //   router.push("/dashboard");
    // }
    // ----------------------------------------
    // if (!email || !password) {
    //   setError("Please fill out all fields.");
    //   return;
    // }

    // if (isLogin) {
    //   // Simulate login (replace with real authentication)
    //   if (email === "rosannezhu@gmail.com" && password === "password") {
    //     router.push("/dashboard"); // Redirect after login
    //   } else {
    //     setError("Invalid credentials.");
    //   }
    // } else {
    //   // Simulate signup (replace with API request)
    //   console.log("Signup:", { email, password });
    //   router.push("/dashboard"); // Redirect after signup
    // }
    router.push("/dashboard"); // Redirect after signup
    // TO DO: redirect to profile setup first
  };

  const handleLogin = () => {
    router.push("/dashboard"); // Redirect to dashboard
  };

  return (
    <div
      // className="flex items-center justify-center min-h-screen bg-gray-100"
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bgs/login.svg')" }}
    >
      <div className=" p-6 rounded-lg w-96">
        <div className="flex justify-center mb-8">
          <img src="/pokemonlogo.png" alt="Pokémon Logo" className="w-74 h-auto" />
        </div>
        <h2 className="text-4xl font-bold mb-8 text-center text-outline font-joystix">
          TRADING DEN
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form 
        onSubmit={handleSubmit} 
        // onClick={handleLogin}
        className="space-y-4">
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
            // onClick={handleLogin}
            className="w-full text-2xl text-white px-4 py-1 rounded-lg" //  text-outline
          >
            LOGIN
          </button>
        </form>
        {/* <button
          onClick={() => signIn("google")}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
        >
          Sign in with Google
        </button> */}
      </div>
    </div>
  );
}
