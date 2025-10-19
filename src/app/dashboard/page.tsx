
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Track your contest activity and progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Registered Contests</h3>
            <p className="text-3xl font-bold text-gray-800">12</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Score</h3>
            <p className="text-3xl font-bold text-gray-700">2,450</p>
            <p className="text-sm text-gray-500">Across all platforms</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Rank</h3>
            <p className="text-3xl font-bold text-gray-600">#127</p>
            <p className="text-sm text-gray-500">Global leaderboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Recent Contests</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Codeforces Round #789</p>
                  <p className="text-sm text-gray-500">Completed • Score: 1850</p>
                </div>
                <span className="text-gray-800 font-semibold">+150 pts</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">LeetCode Weekly Contest 312</p>
                  <p className="text-sm text-gray-500">Completed • Score: 2100</p>
                </div>
                <span className="text-gray-800 font-semibold">+200 pts</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Upcoming Registrations</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <div>
                  <p className="font-medium">AtCoder Beginner Contest 234</p>
                  <p className="text-sm text-gray-500">Starts in 2 hours</p>
                </div>
                <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900">
                  View
                </button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <div>
                  <p className="font-medium">CodeChef Starters 45</p>
                  <p className="text-sm text-gray-500">Starts tomorrow</p>
                </div>
                <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

