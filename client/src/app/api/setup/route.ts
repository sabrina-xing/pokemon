import { NextResponse } from "next/server";
import pool from "../../../../lib/db" // MySQL connection
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const profilePic = formData.get("profilePic") as File | null;

    if (!name || !bio) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let imagePath = null;

    if (profilePic) {
      const bytes = await profilePic.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${profilePic.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    await pool.query("INSERT INTO profiles (name, bio, profile_pic) VALUES (?, ?, ?)", [
      name,
      bio,
      imagePath,
    ]);

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// TO DO: Run this SQL command in MySQL Workbench:
// CREATE TABLE profiles (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     bio TEXT NOT NULL,
//     profile_pic VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );

// TO DO: Create the public/uploads/ folder inside your project:

  