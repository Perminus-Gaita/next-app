"use client";

import { useState } from "react";
import { useAuth, authClient } from "@/lib/auth/client";
import { Loader2, Pencil, X, Check, User, Calendar, ScrollText, MessageSquare } from "lucide-react";
import { getDiceBearAvatar } from "@/features/jackpots/utils/helpers";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");

  const openEdit = () => {
    setEditName(user?.name || "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (editName !== (user.name || "")) {
        await authClient.updateUser({ name: editName });
      }
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Not signed in.</p>
      </div>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto -mt-8">
      <div className="bg-white dark:bg-gray-800 border-x border-b border-border overflow-hidden">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-8 pb-4 px-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Profile"}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow"
            />
          ) : (
            <img
              src={getDiceBearAvatar((user as any).username || user.name || 'anon')}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow"
            />
          )}
        </div>

        {/* Info */}
        <div className="px-4 pb-4 space-y-2">
          <div className="text-center">
            {editing ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-xl font-bold text-center bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-1 border dark:border-gray-600"
                />
                <button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </button>
                <button onClick={() => setEditing(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name || "Anonymous"}
                </h1>
                <button onClick={openEdit}>
                  <Pencil className="w-4 h-4 text-gray-500 hover:text-gray-600" />
                </button>
              </div>
            )}
            {(user as any).username && (
              <p className="text-sm text-muted-foreground mt-0.5">
                @{(user as any).username}
              </p>
            )}
          </div>
        </div>

        {/* Member since */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Joined {memberSince}</span>
        </div>
      </div>
    </div>
  );
}
