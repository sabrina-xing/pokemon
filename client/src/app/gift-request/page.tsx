"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import giftTitle from '../../../public/buttons/gift-title.png';
import Image from "next/image";

interface Transaction {
  tid: number;
  card_id: string;
  sender_id: number;
  receiver_id: number;
  tdate: string;
  t_type: "gift" | "request";
  status?: string;
}

export default function GiftRequest() {
  const [cardId, setCardId] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [requestCardId, setRequestCardId] = useState("");
  const [requestSenderUsername, setRequestSenderUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<Transaction[]>([]);

  console.log("session", session);
  console.log("status", status);
  console.log("name", session?.user?.id);

  console.log("session", session); // Debugging line
  const uid = session?.user?.id;
  console.log("uid", uid); // Debugging line

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
      <div className="">
        {/* <h1 className="text-4xl font-bold mt-6 font-joystix">
          Gift & Request Pokémon Cards
        </h1> */}
        <Image src={giftTitle} alt="Gift Title" width={900} height={40} className="" />
      </div>

      {/* Side-by-side container */}
      <div className="flex flex-col md:flex-row gap-8 px-8 justify-center items-start w-full max-w-6xl">

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
            padding: "50px",
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
              value={requestSenderUsername}
              onChange={(e) => setRequestSenderUsername(e.target.value)}
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
      </div>
      {/* Display messages */}
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>

  );
}
