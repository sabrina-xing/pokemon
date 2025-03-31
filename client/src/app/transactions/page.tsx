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
    
    return (
        <div>
            <h1 className="text-lg font-bold ml-9 text-black">TRANSACTION HISTORY</h1>
            
        </div>
    );
}

