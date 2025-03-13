"use client";

import { useState } from "react";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !bio) {
      setError("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const response = await fetch("/api/profile-setup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
    } catch (error) {
      setError("Error saving profile. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 rounded-lg bg-white shadow-md w-96">
        <h2 className="text-3xl font-bold mb-4 text-center">Profile Setup</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-4">
          <label className="cursor-pointer">
            {preview ? (
              <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                Upload
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
