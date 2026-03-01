"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, User, MessageSquare, ScrollText, Calendar } from "lucide-react";
import { getDiceBearAvatar } from "@/features/jackpots/utils/helpers";

interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  createdAt: string;
  stats: {
    predictions: number;
    comments: number;
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(username)}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("User not found");
          } else {
            setError("Failed to load profile");
          }
          return;
        }
        const data = await res.json();
        setProfile(data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <User className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">{error || "User not found"}</h2>
        <p className="text-sm text-muted-foreground">
          The user @{username} doesn't exist or the profile is not available.
        </p>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto -mt-8">
      <div className="bg-white dark:bg-gray-800 border-x border-b border-border overflow-hidden">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center pt-8 pb-4 px-4">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name || profile.username || "Profile"}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow"
            />
          ) : (
            <img
              src={getDiceBearAvatar(profile.username || 'anon')}
              alt={profile.username || "Profile"}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow"
            />
          )}

          <div className="text-center mt-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {profile.name || profile.username || "Anonymous"}
            </h1>
            {profile.username && (
              <p className="text-sm text-muted-foreground mt-0.5">
                @{profile.username}
              </p>
            )}
          </div>
        </div>

        {/* Member since */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Joined {memberSince}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 border-t border-border">
          <div className="flex flex-col items-center py-4 border-r border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <ScrollText className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-foreground">{profile.stats.predictions}</div>
            <div className="text-xs text-muted-foreground">Predictions</div>
          </div>
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-foreground">{profile.stats.comments}</div>
            <div className="text-xs text-muted-foreground">Comments</div>
          </div>
        </div>
      </div>
    </div>
  );
}
