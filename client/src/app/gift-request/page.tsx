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

  // Fetch user requests
  const fetchRequests = async () => {
    if (!uid) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/user_transaction?uid=${uid}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data.filter((tx: Transaction) => tx.t_type === "request" || tx.t_type === "gift");
        setRequests(filtered);
      } else if (data.message === "No transactions found") {
        setRequests([]); // just no requests, not an error
      } else {
        setError(data.error || "Could not load requests.");
      }
    } catch (err) {
      setError("Failed to fetch transactions.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [uid]);

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

  
  const handleAccept = async (tid: number) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/accept_transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tid, uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Transaction accepted.");
      setRequests((prev) => prev.filter((tx) => tx.tid !== tid));
    } catch (err) {
      setError("Error accepting transaction.");
    }
  };

  const handleReject = async (tid: number) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/reject_transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tid, uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Transaction rejected.");
      setRequests((prev) => prev.filter((tx) => tx.tid !== tid));
    } catch (err) {
      setError("Error rejecting transaction.");
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

      {requests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
          {requests.map((tx) => (
            <div key={tx.tid} className="border p-4 rounded bg-white mb-2">
              <p>Card ID: {tx.card_id}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleAccept(tx.tid)} className="bg-green-500 text-white px-3 py-1 rounded">
                  Accept
                </button>
                <button onClick={() => handleReject(tx.tid)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
