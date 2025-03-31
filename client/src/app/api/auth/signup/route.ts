import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "../../../lib/db"; // MySQL connection

// MySQL Table Schema (for reference)
// CREATE TABLE account (
//     uid INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(40) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     usr_password VARCHAR(255) NOT NULL,
//     bio VARCHAR(255),
//     pfp VARCHAR(255)
// );

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Check if email already exists
        const [existingEmail]: any[] = await pool.query("SELECT * FROM account WHERE email = ?", [email]);
        if (existingEmail.length > 0) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // Check if username already exists
        const [existingUsername]: any[] = await pool.query("SELECT * FROM account WHERE username = ?", [name]);
        if (existingUsername.length > 0) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into MySQL database
        await pool.query(
            "INSERT INTO account (username, email, usr_password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        return NextResponse.json({ message: "User created successfully" });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
