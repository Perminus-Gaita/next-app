"use client";

import { useState } from "react";
import { useAuth, authClient } from "@/lib/auth/client";
import { Loader2, Pencil, X, Check, User } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Not signed in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-16">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-8 pb-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Profile"}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 pb-6 space-y-4">
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
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name || "Anonymous"}
                </h1>
                <button onClick={openEdit}>
                  <Pencil className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
