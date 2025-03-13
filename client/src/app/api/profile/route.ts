import { NextResponse } from "next/server";
import pool from "../../../../lib/db"; // MySQL connection

export async function GET(req: Request) {
  const userId = 1; // Replace with session-based user ID

  try {
    // Fetch user details
    const [userResults] = await pool.query("SELECT * FROM profiles WHERE id = ?", [userId]);
    const user = (userResults as any[])[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user's Pokémon cards
    const [cardResults] = await pool.query("SELECT * FROM pokemon_cards WHERE owner_id = ?", [userId]);

    return NextResponse.json({
      user,
      cards: cardResults,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
