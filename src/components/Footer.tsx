import React from 'react'
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contest Radar</h3>
            <p className="text-gray-400">
              Your ultimate platform for discovering and tracking coding contests from top platforms worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/contests" className="text-gray-400 hover:text-white transition duration-300">Contests</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition duration-300">Dashboard</Link></li>
              <li><Link href="/leaderboard" className="text-gray-400 hover:text-white transition duration-300">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">support@contestradar.com</p>
            <p className="text-gray-400">&copy; 2025 Contest Radar. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
