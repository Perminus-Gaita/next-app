"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
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

  useEffect(() => {
    // Tier 1: Own profile — use session data
    const isOwnProfile = sessionUser?.username === username;
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

    // Tier 2: Store has preview data from a clicked link
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

    // Tier 3: Fallback — fetch from API (direct URL visit / refresh)
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) {
          setError(res.status === 404 ? "User not found" : "Failed to load profile");
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
  }, [username, sessionUser, preview, clearPreview]);

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
      <div className="flex items-center gap-3 py-4">
        <Avatar className="h-11 w-11">
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
    </div>
  );
}
