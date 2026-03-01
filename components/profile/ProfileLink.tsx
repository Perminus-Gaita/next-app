"use client";

import Link from "next/link";
import { useProfileStore } from "@/lib/stores/profile-store";

interface ProfileLinkProps {
  username: string;
  name: string | null;
  image: string | null;
  children: React.ReactNode;
  className?: string;
}

export default function ProfileLink({
  username,
  name,
  image,
  children,
  className,
}: ProfileLinkProps) {
  const { setPreview } = useProfileStore();

  const handleClick = () => {
    setPreview({ name, username, image });
  };

  return (
    <Link
      href={`/${username}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}
