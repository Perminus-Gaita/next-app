import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nyumbani - Zeqqat",
  description: "Track SportPesa Mega Jackpot results, view match outcomes, share predictions with the community.",
};

export default function NyumbaniPage() {
  // Redirect to latest jackpot - the /j/latest route handles fetching
  redirect("/j/latest");
}
