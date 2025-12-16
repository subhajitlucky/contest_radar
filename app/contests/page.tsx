import { getUpcomingContests, getRelativeTime, formatContestDate, formatDuration, getContestStats } from '@/lib/contestService';
import Link from 'next/link';

export default async function ContestsPage() {
  // Fetch all Codeforces contests
  const contests = await getUpcomingContests();
  const stats = await getContestStats();

  // No filters needed - pure Codeforces
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Past contests for comparison
  const pastContests = [
    {
      id: "cf_div3_899",
      name: "Codeforces Div. 3 #899",
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      type: "Div. 3",
      difficulty: "Easy",
    },
    {
      id: "cf_edu_159",
      name: "Codeforces Educational Round #159",
      startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 135,
      type: "Educational",
      difficulty: "Medium",
    },
  ];

  // Difficulty badge color helper
  function getDifficultyColor(difficulty: string | undefined): string {
    if (!difficulty) return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    if (difficulty.includes('Hard')) return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    if (difficulty.includes('Medium')) return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
  }

  return (
    <div className="bg-white dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Codeforces Contests
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-time contest schedule from Codeforces API. Never miss a contest again.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.upcoming}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Upcoming</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalContests.toLocaleString()}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Total Tracked</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.next24h}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Next 24h</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.active}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Live Now</div>
          </div>
        </div>

        {/* Main Contests List */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></span>
              Upcoming Contests
            </h2>
            <a
              href="https://codeforces.com/contests"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visit Codeforces
            </a>
          </div>

          {contests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400">No upcoming contests found.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Check back later or try gym contests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all bg-white dark:bg-gray-900"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                    {/* Left: Contest Info */}
                    <div className="flex-1 space-y-3">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          Codeforces
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white bg-blue-600">
                          {contest.type}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getDifficultyColor(contest.difficulty)}`}>
                          {contest.difficulty}
                        </span>
                        {contest.isRegistrationOpen && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                            OPEN
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {contest.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {contest.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDuration(contest.duration)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {contest.participants?.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getRelativeTime(contest.startTime)}
                        </div>
                        {contest.phase === "CODING" && (
                          <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="4" />
                            </svg>
                            LIVE
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2 text-right min-w-[200px]">
                      <div>
                        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Starts</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatContestDate(contest.startTime)}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                          Remind
                        </button>
                        <a
                          href={contest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Visit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Contests */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full"></span>
            Recent Completed
          </h2>

          <div className="space-y-3">
            {pastContests.map((contest) => (
              <div
                key={contest.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    Codeforces
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white">
                    {contest.type}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {contest.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getDifficultyColor(contest.difficulty)}`}>
                    {contest.difficulty}
                  </span>
                  <span>•</span>
                  <span>{formatDuration(contest.duration)}</span>
                  <span>•</span>
                  <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                  <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                    Results
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                Missing Contests?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This is Codeforces official API. Gym contests require login via the website.
                <br/>
                API updates every 5 minutes. Times are shown in your local timezone.
              </p>
            </div>
            <a
              href="/subscribe"
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Get Notifications
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}