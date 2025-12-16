import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Contest<span className="text-blue-600 dark:text-blue-400">Radar</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The Codeforces contest tracker with real-time API data, notifications, and analytics.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                🎯
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              At ContestRadar, we believe every competitive programmer deserves to stay informed about Codeforces contests
              in real-time without checking multiple sites. We use the official Codeforces API to provide accurate, up-to-date
              contest information with intelligent notifications and reminders.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon="🔔"
              title="Real-time Notifications"
              description="Get notified exactly when new contests are announced or schedules change"
            />
            <FeatureCard
              icon="📊"
              title="Codeforces Analytics"
              description="View statistics about upcoming contests, active contests, and trends"
            />
            <FeatureCard
              icon="⏰"
              title="Smart Reminders"
              description="Set custom reminders 1 hour, 30 minutes, or 15 minutes before contests"
            />
            <FeatureCard
              icon="📱"
              title="Mobile Friendly"
              description="Access your contest schedule on any device, anywhere, anytime"
            />
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Data Source</h2>
          <div className="space-y-4">
            <PlatformCard
              name="Codeforces API"
              description="Real-time data from official API - Div. 1, Div. 2, Div. 3, Div. 4, Educational Rounds, and more"
              Link="codeforces.com/api"
              color="blue"
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About the Team</h2>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              ContestRadar is built by competitive programmers, for competitive programmers. We're a passionate team
              who understands the challenges of staying updated with the rapidly growing competitive programming ecosystem.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our goal is to make this platform free and accessible to everyone in the competitive programming community.
              Whether you're a beginner just starting your journey or a seasoned competitor, we're here to help you
              never miss a contest.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Is ContestRadar completely free?
                <span className="float-right group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                Yes! ContestRadar is 100% free to use. We may introduce premium features in the future, but core functionality will always remain free.
              </div>
            </details>

            <details className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                How accurate are the contest details?
                <span className="float-right group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                We use the official Codeforces API, which updates in real-time. Usually updates appear within minutes of official announcements.
              </div>
            </details>

            <details className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Does ContestRadar support other platforms besides Codeforces?
                <span className="float-right group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                We focus exclusively on Codeforces. Other platforms like AtCoder and LeetCode don't have reliable public APIs for contest tracking.
              </div>
            </details>

            <details className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                What does "remind me" feature do?
                <span className="float-right group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                When you click "Remind Me" on a contest, you'll be prompted to subscribe. You can configure alerts at specific times before contests start (1h, 30min, etc.).
              </div>
            </details>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Have Questions?</h3>
                <p className="text-blue-100 mb-4">
                  We'd love to hear from you. Whether you have suggestions, bug reports, or just want to say hello!
                </p>
                <div className="flex gap-3">
                  <a href="mailto:contact@contestradar.com" className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    ✉️ Email
                  </a>
                  <Link href="/contact" className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    📝 Contact Form
                  </Link>
                </div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <span>Launching new features regularly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <span>Active community support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">❤️</span>
                    <span>Built by programmers, for programmers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="text-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Last updated: December 2025</p>
          <p className="mt-1">Made with ❤️ and lots of ☕</p>
        </div>

      </div>
    </div>
  );
}

// Sub-components
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function PlatformCard({ name, description, Link, color }: { name: string; description: string; Link: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: "border-blue-500",
    orange: "border-orange-500",
    red: "border-red-500",
  };

  const bgClasses: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    orange: "bg-orange-50 dark:bg-orange-900/20",
    red: "bg-red-50 dark:bg-red-900/20",
  };

  return (
    <div className={`p-6 rounded-2xl border-l-4 ${colorClasses[color]} ${bgClasses[color]} dark:bg-gray-900/50`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
        </div>
        <a
          href={`https://${Link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded hover:opacity-90 transition-opacity"
        >
          Visit →
        </a>
      </div>
    </div>
  );
}