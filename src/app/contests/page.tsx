
export default function ContestsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Contests</h1>
          <p className="text-lg text-gray-600">Discover contests from top coding platforms</p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition duration-300">
            All Platforms
          </button>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-800 hover:bg-gray-50 transition duration-300">
            Codeforces
          </button>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-800 hover:bg-gray-50 transition duration-300">
            LeetCode
          </button>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-800 hover:bg-gray-50 transition duration-300">
            AtCoder
          </button>
        </div>



      </div>
    </div>
  );
}

