import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to My App
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your app is ready to build!
        </p>
        <Link
          href="/nyumbani"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}