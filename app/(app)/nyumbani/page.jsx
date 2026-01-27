import { Suspense } from "react";
import Nyumbani from "./client";

export const metadata = {
  title: "Nyumbani - Home",
  description: "Welcome to Nyumbani - your home for markets, pools, and more!",
  keywords: ["nyumbani", "home", "markets", "pools", "leaderboard"],
};

const Page = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <Nyumbani />
    </Suspense>
  );
};

export default Page;
