import { getContestStats, getUpcomingContests } from '@/lib/contestService';
import { formatContestDate, getRelativeTime } from '@/lib/contestService';

export default async function CodeforcesTracker() {
  // Fetch real-time data from Codeforces API
  const stats = await getContestStats();
  const contests = await getUpcomingContests();

  // Get next contest + upcoming list
  const nextContest = contests[0] || null;
  const upcomingContests = contests.slice(1, 4); // Next 3 contests

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Real-Time Codeforces Data
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Codeforces Contest Dashboard
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Live tracking via official API. Refreshes every 5 minutes.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* Left: Large Stats Card */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              {/* Header - Animated Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] animate-gradient text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4h18v2H3V4zm2 4h14v12H5V8zm2 2v8h10v-8H7z"/>
                      </svg>
                      Codeforces Overview
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">Official API Integration</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">{stats.upcoming}</span>
                    <div className="text-blue-100 text-xs">UPCOMING</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.active > 0 ? '🔴' : '🟢'}
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      {stats.active > 0 ? 'Live Now' : 'Ready'}
                    </div>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {stats.next24h}
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      Next 24h
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.totalContests.toLocaleString()}
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      Tracked Total
                    </div>
                  </div>
                </div>

                {nextContest ? (
                  <div className="space-y-4">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Next Contest
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                          {getRelativeTime(nextContest.startTime)}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-600/10 dark:bg-blue-400/10 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {nextContest.type.split(' ').map(w => w[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white truncate">
                              {nextContest.name}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                {formatContestDate(nextContest.startTime)}
                              </span>
                              <span>•</span>
                              <span>{nextContest.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming List */}
                    {upcomingContests.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                          More Upcoming
                        </div>
                        <div className="space-y-2">
                          {upcomingContests.map((contest) => (
                            <div key={contest.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs font-bold px-2 py-1 bg-blue-600 text-white rounded">
                                  {contest.type.split(' ').map(w => w[0]).join('')}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {contest.name}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                {getRelativeTime(contest.startTime)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p>No upcoming contests found</p>
                    <p className="text-sm mt-1">Check back soon or try gym contests</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions & Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Quick Actions</h4>
              <div className="space-y-3">
                <a href="/contests" className="flex items-center justify-between w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                  <span>View Full List</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </a>
                <a href="https://codeforces.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors">
                  <span>Codeforces.com</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
                <a href="/subscribe" className="flex items-center justify-between w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                  <span>Get Notifications</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Data Status</h4>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Live from API</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-white/50 dark:bg-black/30 rounded">5 min refresh</span>
                  <span>Auto-sync</span>
                </div>
                <div className="text-xs mt-3 pt-3 border-t border-blue-200/30 dark:border-blue-800/30">
                  <strong>API Endpoint:</strong><br/>
                  <code className="font-mono text-xs bg-white/50 dark:bg-black/20 px-1 py-0.5 rounded">codeforces.com/api/contest.list</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Currently tracking <span className="font-semibold text-gray-900 dark:text-white">{stats.totalContests.toLocaleString()}</span> Codeforces contests with live updates</p>
        </div>
      </div>
    </div>
  );
}