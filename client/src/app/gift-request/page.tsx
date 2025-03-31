"use client";

import { useState } from "react";
import giftTitle from '../../../public/buttons/gift-title.png';
import Image from "next/image";


export default function GiftRequest() {
  const [cardId, setCardId] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [senderUsername, setSenderUsername] = useState("");
  const [requestCardId, setRequestCardId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to gift a card
  const handleGift = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      // TO DO: test this route
      const response = await fetch("http://127.0.0.1:5000/gift_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: cardId, receiver_username: receiverUsername }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to gift card.");

      setMessage(`Successfully gifted card ${cardId} to ${receiverUsername}!`);
    } catch (err) {
      setError("Error gifting card. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to request a card
  const handleRequest = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      // TO DO: implement the backend route for this and test it
      const response = await fetch("http://127.0.0.1:5000/request_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: requestCardId, sender_username: senderUsername }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to request card.");

      setMessage(`Successfully requested card ${requestCardId} from ${senderUsername}!`);
    } catch (err) {
      setError("Error requesting card. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-black">
      <div className="mt-8">
        {/* <h1 className="text-4xl font-bold mt-6 font-joystix">
          Gift & Request Pokémon Cards
        </h1> */}
        <Image src={giftTitle} alt="Gift Title" width={900} height={40} className="" />
      </div>
      {/* Gift a Card */}
      <div
        style={{
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {/* 
          marginTop: "20px", */}
        <div
          style={{
            display: "inline-block",
            width: "35vw",
            backgroundColor: "white",
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
            padding: "20px",
            paddingLeft: "30px",
          }}
        >
          <h2 className="text-xl font-bold text-[#bd524d]">Gift a Pokémon Card</h2>
        </div>
        <div className="p-16 justify-center items-center flex flex-col"
          style={{
            display: "flex",
            width: "35vw",
            backgroundImage: "linear-gradient(#d76660, #f99987)",
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
            padding: "20px",
            paddingLeft: "30px",
            minHeight: "300px",
            boxShadow: "inset 0 0 0 6px white",
          }}>
          <input
            type="text"
            placeholder="Card ID"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-gray-50"
          />
          <input
            type="text"
            placeholder="Receiver's Username"
            value={receiverUsername}
            onChange={(e) => setReceiverUsername(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-gray-50"
          />
          <button
            onClick={handleGift}
            disabled={loading}
            className="mt-4 px-6 py-3 rounded-full text-[#bd524d] bg-white hover:bg-[#f7e0df] disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Gift Card"}
          </button>
        </div>

      </div>

      {/* Request a Card */}
      <div className="pt-0 p-[50px]"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {/* 
          paddingTop: "0px",
          padding: "50px",
          marginTop: "20px", */}
        <div
          style={{
            display: "inline-block",
            width: "35vw",
            backgroundColor: "white",
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
            padding: "20px",
            paddingLeft: "30px",
          }}
        >
          <h2 className="text-xl font-bold text-[#bd524d]">Request a Pokémon Card</h2>
        </div>
        <div className="p-16 justify-center items-center flex flex-col"
          style={{
            display: "flex",
            width: "35vw",
            backgroundImage: "linear-gradient(#d76660, #f99987)",
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
            padding: "20px",
            paddingLeft: "30px",
            minHeight: "300px",
            boxShadow: "inset 0 0 0 6px white",
          }}>
          <input
            type="text"
            placeholder="Card ID"
            value={requestCardId}
            onChange={(e) => setRequestCardId(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-gray-50"
          />
          <input
            type="text"
            placeholder="Sender's Username"
            value={senderUsername}
            onChange={(e) => setSenderUsername(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-gray-50"
          />
          <button
            onClick={handleRequest}
            disabled={loading}
            className="mt-4 px-6 py-3 text-[#bd524d] bg-white rounded-full hover:bg-[#f7e0df] disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Request Card"}
          </button>
        </div>
      </div>
      {/* Display messages */}
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
