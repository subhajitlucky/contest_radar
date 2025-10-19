
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-gray-900">Contest Radar</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, track, and participate in coding contests from Codeforces, LeetCode, AtCoder, and more.
            Never miss an opportunity to challenge yourself and climb the leaderboard.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/contests"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-300"
            >
              View Contests
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold border border-gray-800 hover:bg-gray-50 transition duration-300"
            >
              My Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-700 text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Track Contests</h3>
            <p className="text-gray-600">Stay updated with upcoming contests from multiple platforms in one place.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-700 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Personal Dashboard</h3>
            <p className="text-gray-600">Monitor your registrations, scores, and progress with detailed analytics.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-700 text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
            <p className="text-gray-600">Get alerts via our extension or email when contests start.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
