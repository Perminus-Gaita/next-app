"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface InteractiveWrapperProps {
  children: ReactNode;
  fallbackImage?: string;
  fallbackAlt: string;
  caption?: string;
}

export default function InteractiveWrapper({
  children,
  fallbackImage,
  fallbackAlt,
  caption,
}: InteractiveWrapperProps) {
  return (
    <figure className="not-prose">
      <div className="rounded-xl overflow-hidden bg-[#EDE9FE] shadow-lg shadow-violet-200/50 dark:bg-[#1E293B] dark:shadow-lg dark:shadow-black/30">
        {children}
      </div>

      {fallbackImage && (
        <noscript>
          <Image
            src={fallbackImage}
            alt={fallbackAlt}
            width={800}
            height={450}
            className="rounded-xl w-full"
          />
        </noscript>
      )}

      {caption && (
        <figcaption className="text-xs text-gray-600 dark:text-gray-500 text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
