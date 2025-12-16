import { getUpcomingContests, getRelativeTime, formatContestDate, formatDuration } from '@/lib/contestService';

export default async function FeaturedContests() {
  // Fetch Codeforces contests only
  const contests = await getUpcomingContests();

  if (contests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Contests Available</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Unable to fetch contest data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Take top 3 upcoming contests
  const featuredContests = contests.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Contests
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time upcoming contests from Codeforces
            </p>
          </div>
          <a
            href="/contests"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            View All →
          </a>
        </div>

        <div className="space-y-4">
          {featuredContests.map((contest) => (
            <div
              key={contest.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl transition-all bg-white dark:bg-gray-900"
            >
              {/* Left side: Contest info */}
              <div className="flex-1 space-y-3 sm:space-y-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Codeforces
                  </span>
                  <span className="text-sm font-semibold px-2.5 py-1 rounded text-white bg-blue-600">
                    {contest.type}
                  </span>
                  {contest.difficulty && (
                    <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {contest.difficulty}
                    </span>
                  )}
                  {contest.participants && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ~{contest.participants.toLocaleString()} participants
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {contest.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Duration: {formatDuration(contest.duration)}
                  </p>
                  {contest.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contest.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right side: Time and Actions */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getRelativeTime(contest.startTime)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatContestDate(contest.startTime)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Remind Me
                  </button>
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                    aria-label="View contest details"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="mt-6 text-center sm:hidden">
          <a
            href="/contests"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            View All Contests →
          </a>
        </div>

        {/* Callout Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Get notifications in real-time</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subscribe to receive alerts 1 hour before contest starts
                </p>
              </div>
            </div>
            <a
              href="/subscribe"
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors"
            >
              Set Up Alerts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}