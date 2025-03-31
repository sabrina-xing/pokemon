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
        <div>
            <div className="min-h-screen flex flex-col items-center justify-center text-black">
                {requests.length > 0 && (
                    <div className="mt-8 w-[80%]">
                    <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
                    {requests.map((tx) => (
                        <div key={tx.tid} className="border p-4 rounded bg-white mb-2">
                        <p>Card ID: {tx.card_id}</p>
                        <p>Type: {tx.t_type}</p>
                        <p>Date: {tx.tdate}</p>
                        <p>Status: {tx.status}</p>
                        {tx.status == 'in progress' && 
                            (<div className="mt-2 flex gap-2">
                                <button onClick={() => handleAccept(tx.tid)} className="bg-green-500 text-white px-3 py-1 rounded">
                                Accept
                                </button>
                                <button onClick={() => handleReject(tx.tid)} className="bg-red-500 text-white px-3 py-1 rounded">
                                Reject
                                </button>
                            </div>)
                         }
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
}

