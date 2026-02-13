import Link from "next/link";
import LandingToolCarousel from "@/components/landing/LandingToolCarousel";
import LandingCategoryCarousel from "@/components/landing/LandingCategoryCarousel";

export default function LandingPage() {
  return (
    <>

      <div className="pb-6 pt-8">
        {/* ── Hero ── */}
        <div className="mx-auto max-w-2xl px-4 text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
            Master SportPesa Jackpot with Data-Driven Research
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Free guides, strategies, and analysis to help you make smarter betting decisions
          </p>
        </div>

        {/* ── Tool Carousel (one at a time, auto-scroll) ── */}
        <div className="mx-auto max-w-2xl px-4 mb-6">
          <LandingToolCarousel />
        </div>

        {/* ── Category Carousel ── */}
        <div className="mx-auto max-w-2xl px-4 mb-14">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Browse by Category
          </h2>
          <LandingCategoryCarousel />
        </div>

        {/* ── CTA Section ── */}
        <div className="mx-auto max-w-2xl px-4 text-center mb-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to improve your jackpot strategy?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Every tool and guide is completely free. Start with the basics or dive straight into the calculators.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/i/ultimate-guide-sportpesa-jackpot"
              className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors font-medium"
            >
              Start with the Basics
            </Link>
            <Link
              href="/i"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              See All Guides
            </Link>
          </div>
        </div>

        {/* ── SEO Footer ── */}
        <footer className="mx-auto max-w-2xl px-4 border-t border-gray-200 dark:border-gray-800 pt-10">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Strategies</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/i/ultimate-guide-sportpesa-jackpot" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Ultimate Guide</Link>
                <Link href="/i/how-to-predict-draws" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Predict Draws</Link>
                <Link href="/i/how-to-predict-home-win" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Predict Home Wins</Link>
                <Link href="/i/how-to-predict-away-win" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Predict Away Wins</Link>
              </nav>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Site</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/i" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">All Guides</Link>
                <Link href="/i/components" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Interactive Tools</Link>
                <Link href="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Support</Link>
              </nav>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">© 2026 App</p>
          </div>
        </footer>
      </div>
    </>
  );
}
