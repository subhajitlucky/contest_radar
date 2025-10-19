import React from 'react'
import Link from 'next/link';
const Navbar = () => {
    return (
        <>
            <nav className="bg-gray-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition duration-300">
                                Contest Radar
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link href="/home" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-gray-800 transition duration-300">
                                    Home
                                </Link>
                                <Link href="/contests" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-gray-800 transition duration-300">
                                    Contests
                                </Link>
                                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-gray-800 transition duration-300">
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
