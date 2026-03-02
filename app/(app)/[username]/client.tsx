"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Pencil, X, Check, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth/client";
import { useProfileStore } from "@/lib/stores/profile-store";

interface UserProfile {
  name: string | null;
  username: string;
  image: string | null;
}

interface ProfileClientProps {
  username: string;
}

export default function ProfileClient({ username }: ProfileClientProps) {
  const { user: sessionUser } = useAuth();
  const { preview, clearPreview } = useProfileStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = sessionUser?.username === username;

  useEffect(() => {
    if (isOwnProfile && sessionUser) {
      setProfile({
        name: sessionUser.name || null,
        username: sessionUser.username || username,
        image: sessionUser.image || null,
      });
      setLoading(false);
      clearPreview();
      return;
    }

    if (preview && preview.username === username) {
      setProfile({
        name: preview.name,
        username: preview.username,
        image: preview.image,
      });
      setLoading(false);
      clearPreview();
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) {
          setError(
            res.status === 404 ? "User not found" : "Failed to load profile"
          );
          return;
        }
        const data = await res.json();
        setProfile({
          name: data.name,
          username: data.username,
          image: data.image,
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [username, sessionUser, preview, clearPreview, isOwnProfile]);

  // ─── Edit handlers ───

  function startEditing() {
    if (!profile) return;
    setEditName(profile.name || "");
    setEditUsername(profile.username);
    setEditImage(profile.image);
    setAvatarFile(null);
    setEditError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setAvatarFile(null);
    setEditError(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setEditError("Only JPEG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setEditError("Image must be under 2MB");
      return;
    }

    setEditError(null);
    setAvatarFile(file);
    // Show local preview
    const reader = new FileReader();
    reader.onload = () => setEditImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setEditError(null);

    try {
      // 1. Upload avatar if changed
      let newImageUrl = profile.image;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await fetch("/api/upload/avatar", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "Avatar upload failed");
        }
        const { url } = await uploadRes.json();
        newImageUrl = url;
      }

      // 2. Update name/username if changed
      const nameChanged = editName.trim() !== (profile.name || "");
      const usernameChanged =
        editUsername.trim().toLowerCase() !== profile.username;

      if (nameChanged || usernameChanged) {
        const body: { name?: string; username?: string } = {};
        if (nameChanged) body.name = editName.trim();
        if (usernameChanged) body.username = editUsername.trim().toLowerCase();

        const updateRes = await fetch("/api/users/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!updateRes.ok) {
          const err = await updateRes.json();
          throw new Error(err.error || "Failed to update profile");
        }
      }

      // 3. Update local state
      const updatedProfile: UserProfile = {
        name: editName.trim() || null,
        username: usernameChanged
          ? editUsername.trim().toLowerCase()
          : profile.username,
        image: newImageUrl,
      };
      setProfile(updatedProfile);
      setIsEditing(false);
      setAvatarFile(null);

      // If username changed, redirect to new profile URL
      if (usernameChanged && updatedProfile.username !== username) {
        window.location.href = `/${updatedProfile.username}`;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setEditError(message);
    } finally {
      setSaving(false);
    }
  }

  // ─── Render ───

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400">
          {error || "User not found"}
        </p>
      </div>
    );
  }

  const initials = (profile.name || profile.username || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-full">
      {/* Profile Header */}
      <div className="border-b p-4 relative">
        {/* Edit button — only on own profile, only when not editing */}
        {isOwnProfile && !isEditing && (
          <button
            onClick={startEditing}
            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}

        {/* Cancel / Save buttons when editing */}
        {isEditing && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1.5 rounded-full text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Save profile"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {/* Profile info row */}
        {!isEditing ? (
          /* ── View mode ── */
          <div className="flex items-center gap-3">
            <Avatar className="h-[50px] w-[50px] shrink-0">
              <AvatarImage
                src={profile.image || undefined}
                alt={profile.name || profile.username}
              />
              <AvatarFallback className="text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {profile.name || profile.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{profile.username}
              </p>
            </div>
          </div>
        ) : (
          /* ── Edit mode ── */
          <div className="flex items-start gap-3 pr-16">
            {/* Avatar with camera overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative shrink-0 group"
            >
              <Avatar className="h-[50px] w-[50px]">
                <AvatarImage
                  src={editImage || undefined}
                  alt="Avatar preview"
                />
                <AvatarFallback className="text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </button>

            {/* Name + Username inputs */}
            <div className="flex-1 min-w-0 space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Display name"
                maxLength={50}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 text-base font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 pb-1 transition-colors"
              />
              <div className="flex items-center">
                <span className="text-sm text-gray-400">@</span>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) =>
                    setEditUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                    )
                  }
                  placeholder="username"
                  maxLength={20}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 pb-1 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {editError && (
          <p className="text-xs text-red-500 mt-2">{editError}</p>
        )}
      </div>
    </div>
  );
}
