"use client";

import { useState, useEffect, useRef } from "react";
import { authClient, useSession } from "@/lib/auth/client";
import { Loader2, Pencil, X, Check, Camera, User } from "lucide-react";

export default function ProfilePage() {
  const { data: sessionData, isPending: loading } = useSession();
  const user = sessionData?.user || null;
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setIsOwnProfile(true);
    }
  }, [user]);

  const openEdit = () => {
    setEditName(user?.name || "");
    setEditUsername(username);
    setEditBio(bio);
    setEditAvatar(user?.image || "");
    setShowAvatarUrlInput(false);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updateData: { name?: string; image?: string } = {};
      if (editName !== (user.name || "")) updateData.name = editName;
      if (editAvatar !== (user.image || "")) updateData.image = editAvatar;
      if (Object.keys(updateData).length > 0) {
        await authClient.updateUser(updateData);
      }
      setUsername(editUsername);
      setBio(editBio);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const displayName = user.name || "Anonymous";
  const displayAvatar = user.image || "";
  const displayUsername = username || "username";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          )}
          {editing && (
            <button
              onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex-1">
          {editing ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none w-full text-gray-900 dark:text-white"
              placeholder="Display name"
            />
          ) : (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
          )}
          <p className="text-sm text-gray-500">@{displayUsername}</p>
        </div>
        {isOwnProfile && !editing && (
          <button
            onClick={openEdit}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}
        {editing && (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 text-green-500 hover:text-green-700"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            </button>
            <button
              onClick={cancelEdit}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {showAvatarUrlInput && editing && (
        <div className="mb-4">
          <input
            ref={avatarInputRef}
            value={editAvatar}
            onChange={(e) => setEditAvatar(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-sm text-gray-900 dark:text-white outline-none"
            placeholder="Avatar URL"
          />
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>{user.email}</p>
      </div>
    </div>
  );
}
