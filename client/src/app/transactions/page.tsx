"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Transaction {
  tid: number;
  card_id: string;
  sender_id: number;
  receiver_id: number;
  tdate: string;
  t_type: "gift" | "request";
  status?: string;
}

export default function Transaction() {
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


  const handleAccept = async (tid: number) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/accept_transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tid: tid, uid: uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Transaction accepted.");
      window.location.reload();
      //   setRequests((prev) => prev.filter((tx) => tx.tid !== tid));
    } catch (err) {
      setError("Error accepting transaction.");
    }
  };

  const handleReject = async (tid: number) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/reject_transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tid: tid, uid: uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Transaction rejected.");
      window.location.reload();
      //   setRequests((prev) => prev.filter((tx) => tx.tid !== tid));
    } catch (err) {
      console.log()
      setError("Error rejecting transaction.");
    }
  };

  return (
    <div>
      <div className="pt-10 flex flex-col items-center justify-center text-black">
        <div
          style={{
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <div
            style={{
              display: "inline-block",
              width: "45vw",
              backgroundColor: "white",
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
              padding: "20px",
              paddingLeft: "30px",
            }}
          >
            <h2 className="text-xl font-bold text-[#bd524d]">Pending Requests</h2>
          </div>
          <div
            className="p-16 flex flex-col text-left"
            style={{
              display: "flex",
              width: "45vw",
              backgroundImage: "linear-gradient(#d76660, #f99987)",
              borderBottomRightRadius: "10px",
              borderBottomLeftRadius: "10px",
              padding: "20px",
              paddingLeft: "30px",
              minHeight: "300px",
              boxShadow: "inset 0 0 0 6px white",
            }}
          >
            {requests.length > 0 && (
              <div className="text-white text-left">
                {requests.map((tx) => (
                  <div key={tx.tid} className="border rounded-lg bg-white text-[#d76660] p-4 mb-2">
                    <p><strong>Card ID:</strong> {tx.card_id}</p>
                    <p><strong>Type:</strong> {tx.t_type}</p>
                    <p><strong>Date:</strong> {tx.tdate}</p>
                    <p><strong>Status:</strong> {tx.status}</p>
                    {tx.status == "in progress" && tx.receiver_id == uid && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleAccept(tx.tid)}
                          className="bg-green-500 text-white p-2 rounded-full cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(tx.tid)}
                          className="bg-red-500 text-white p-2 rounded-full cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

