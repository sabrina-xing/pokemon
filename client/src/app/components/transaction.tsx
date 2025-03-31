interface Transaction {
    tid: number;
    card_id: string;
    sender_id: number;
    receiver_id: number;
    tdate: string;
    t_type: "gift" | "request";
    status?: string;
}
  
  export default function Transaction({ transaction }: { transaction: Transaction }) {
    return (

    );
  }
  