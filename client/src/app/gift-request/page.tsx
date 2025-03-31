"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
// import Navbar from "../components/navbar";

export default function GiftRequest() {
  const [cardId, setCardId] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [requestCardId, setRequestCardId] = useState("");
  const [requestSenderUsername, setRequestSenderUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session, status } = useSession();

  console.log("session", session);
  console.log("status", status);
  console.log("name", session?.user?.id);


  const uid = session?.user?.id;

  // Function to gift a card
  const handleGift = async () => {

    if (!uid) {
      setError("User not logged in.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/gift_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          card_id: cardId, 
          receiver_username: receiverUsername,
          sender_uid: uid
           }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to gift card.");

      setMessage(`Successfully requested to gift card ${cardId} to ${receiverUsername}!`);
    } catch (err) {
      setError("Error gifting card. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to request a card
  const handleRequest = async () => {

    if (!uid) {
      setError("User not logged in.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/request_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          card_id: requestCardId, 
          sender_username: requestSenderUsername,
          receiver_uid: uid, }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to request card.");

      setMessage(`Successfully requested card ${requestCardId} from ${requestSenderUsername}!`);
    } catch (err) {
      setError("Error requesting card. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-black">
      {/* <Navbar /> */}
      <h1 className="text-4xl font-bold mt-6 font-joystix">Gift & Request Pokémon Cards</h1>

      {/* Gift a Card */}
      <div className="mt-8 p-6 w-96 bg-white shadow-lg rounded-lg border-2 border-black">
        <h2 className="text-xl font-bold">Gift a Pokémon Card</h2>
        <input
          type="text"
          placeholder="Card ID"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          className="w-full mt-2 px-4 py-2 border rounded-lg bg-gray-50"
        />
        <input
          type="text"
          placeholder="Receiver's Username"
          value={receiverUsername}
          onChange={(e) => setReceiverUsername(e.target.value)}
          className="w-full mt-2 px-4 py-2 border rounded-lg bg-gray-50"
        />
        <button
          onClick={handleGift}
          disabled={loading}
          className="mt-4 px-6 py-3 w-full text-black border-2 rounded-lg hover:bg-gray-100 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Gift Card"}
        </button>
      </div>

      {/* Request a Card */}
      <div className="mt-8 p-6 w-96 bg-white shadow-lg rounded-lg border-2 border-black">
        <h2 className="text-xl font-bold">Request a Pokémon Card</h2>
        <input
          type="text"
          placeholder="Card ID"
          value={requestCardId}
          onChange={(e) => setRequestCardId(e.target.value)}
          className="w-full mt-2 px-4 py-2 border rounded-lg bg-gray-50"
        />
        <input
          type="text"
          placeholder="Sender's Username"
          value={requestSenderUsername}
          onChange={(e) => setRequestSenderUsername(e.target.value)}
          className="w-full mt-2 px-4 py-2 border rounded-lg bg-gray-50"
        />
        <button
          onClick={handleRequest}
          disabled={loading}
          className="mt-4 px-6 py-3 w-full text-black border-2 bg-white rounded-lg hover:bg-gray-100 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Request Card"}
        </button>
      </div>

      {/* Display messages */}
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
