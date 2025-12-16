export default function SubscribePage() {
  return (
    <div className="bg-white dark:bg-gray-950 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get Contest Alerts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Subscribe to receive notifications 1 hour before each contest starts
          </p>
        </div>

        {/* Warning Box */}
        <div className="mb-8 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                Coming Soon Feature
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This feature is currently in development and will be available soon. Please check back later or contact us for updates.
              </p>
            </div>
          </div>
        </div>

        {/* Mock Form */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 opacity-60 pointer-events-none">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Platform Preferences
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" disabled checked /> Codeforces (all contest types)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notification Time
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                >
                  <option>1 hour before</option>
                  <option>30 minutes before</option>
                  <option>15 minutes before</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-not-allowed opacity-50"
              disabled
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Alternative Contact */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Need this feature urgently?
          </p>
          <a
            href="mailto:contact@contestradar.com?subject=Subscribe Feature Request"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            ✉️ Contact us to request early access
          </a>
        </div>

        {/* Benefits Preview */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            What You'll Get
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
              <div className="text-2xl mb-2">⏰</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Timely Reminders</div>
            </div>
            <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Custom Filters</div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Multi-channel</div>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>We respect your privacy. No spam, unsubscribe anytime.</p>
        </div>

      </div>
    </div>
  );
}