    import { NextResponse } from "next/server";
    import bcrypt from "bcrypt";
    import pool from "../../../../../lib/db"; // MySQL connection

    // User schema for MySQL database:
    // CREATE TABLE users (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     email VARCHAR(255) UNIQUE NOT NULL,
    //     password VARCHAR(255) NOT NULL,
    //     name VARCHAR(255),
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );

    export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    try {
        // Check if user already exists
        const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if ((existingUsers as any[]).length > 0) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into MySQL database
        await pool.query("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", [
        email,
        hashedPassword,
        name,
        ]);

        return NextResponse.json({ message: "User created successfully" });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
    }
