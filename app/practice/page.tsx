import Link from "next/link";

const dataStructures = [
  {
    id: 1,
    title: "Arrays & Strings",
    description: "Basic building blocks - arrays, strings, 2D arrays",
    topics: ["Sliding Window", "Prefix Sums", "Two Pointers", "Substrings"],
    difficulty: "Beginner",
    color: "green",
    resources: [
      { name: "Codeforces EDU - Two Pointers", url: "https://codeforces.com/edu/course/2/lesson/9" },
      { name: "LeetCode Patterns", url: "https://seanprashad.com/leetcode-patterns/" },
      { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/array-data-structure/" }
    ]
  },
  {
    id: 2,
    title: "Linked Lists",
    description: "Singly, doubly, circular linked lists and operations",
    topics: ["Fast & Slow Pointers", "Cycle Detection", "Reversal", "Merging"],
    difficulty: "Easy",
    color: "blue",
    resources: [
      { name: "VisualAlgo", url: "https://visualgo.net/en/list" },
      { name: "HackerRank", url: "https://www.hackerrank.com/domains/data-structures?filters%5Bsubdomains%5D%5B%5D=linked-lists" }
    ]
  },
  {
    id: 3,
    title: "Stacks & Queues",
    description: "LIFO and FIFO operations, monotonic stacks",
    topics: ["Monotonic Stack", "Custom Queue", "Infix/Postfix", "Two Stacks"],
    difficulty: "Easy",
    color: "blue",
    resources: [
      { name: "Codeforces EDU - Stack", url: "https://codeforces.com/edu/course/2/lesson/7" },
      { name: "Programiz", url: "https://www.programiz.com/dsa/stack" }
    ]
  },
  {
    id: 4,
    title: "Trees & BST",
    description: "Binary trees, BST, traversals, balanced trees",
    topics: ["DFS/BFS", "Height/Depth", "BST Validation", "Lowest Common Ancestor"],
    difficulty: "Medium",
    color: "orange",
    resources: [
      { name: "CP-Algorithms - Trees", url: "https://cp-algorithms.com/graph/tree-basics.html" },
      { name: "LeetCode Tree (Practice)", url: "https://leetcode.com/tag/tree/" }
    ]
  },
  {
    id: 5,
    title: "Graphs & Trees (Advanced)",
    description: "Graph traversals, shortest paths, connectivity",
    topics: ["BFS/DFS", "Dijkstra", "Floyd-Warshall", "Topological Sort", "Union-Find"],
    difficulty: "Hard",
    color: "red",
    resources: [
      { name: "Codeforces EDU - Graphs", url: "https://codeforces.com/edu/course/2/lesson/6" },
      { name: "USACO Guide", url: "https://usaco.guide/bronze/" }
    ]
  },
  {
    id: 6,
    title: "Hash Tables & Sets",
    description: "Hashing, collision resolution, frequency counting",
    topics: ["Hash Maps", "Set Operations", "Two Sum", "Subarray Sum"],
    difficulty: "Easy",
    color: "green",
    resources: [
      { name: "Codeforces Hashing", url: "https://codeforces.com/blog/entry/61159" },
      { name: "HackerEarth", url: "https://www.hackerearth.com/practice/data-structures/hash-tables/tutorial/" }
    ]
  }
];

const algorithms = [
  {
    id: 1,
    title: "Searching & Sorting",
    description: "Binary search, merge sort, quicksort, custom comparators",
    topics: ["Binary Search", "Two Pointers", "Merge Sort", "Heapsort"],
    difficulty: "Easy-Medium",
    color: "green",
    resources: [
      { name: "VisualGo Sorting", url: "https://visualgo.net/en/sorting" },
      { name: "CP-Algorithms", url: "https://cp-algorithms.com/" },
      { name: "Codeforces EDU", url: "https://codeforces.com/edu/course/2" }
    ]
  },
  {
    id: 2,
    title: "Dynamic Programming",
    description: "Optimization problems with overlapping subproblems",
    topics: ["1D DP", "2D DP", "Knapsack", "LCS", "Knuth Optimization"],
    difficulty: "Hard",
    color: "red",
    resources: [
      { name: "Codeforces DP Course", url: "https://codeforces.com/edu/course/2/lesson/7" },
      { name: "AtCoder DP Contest", url: "https://atcoder.jp/contests/dp" }
    ]
  },
  {
    id: 3,
    title: "Greedy Algorithms",
    description: "Local optimal choices leading to global optimum",
    topics: ["Activity Selection", "Fractional Knapsack", "Interval Scheduling"],
    difficulty: "Medium",
    color: "orange",
    resources: [
      { name: "GeeksforGeeks - Greedy", url: "https://www.geeksforgeeks.org/greedy-algorithms/" },
      { name: "Codeforces EDU", url: "https://codeforces.com/edu/course/2" }
    ]
  },
  {
    id: 4,
    title: "Backtracking & Recursion",
    description: "DFS-based problem solving, permutation generation",
    topics: ["N-Queens", "Subset Generation", "Permutations", "Game Theory"],
    difficulty: "Medium",
    color: "orange",
    resources: [
      { name: "CP-Algorithms - Backtracking", url: "https://cp-algorithms.com/graph/backtracking.html" },
      { name: "LeetCode Backtracking", url: "https://leetcode.com/tag/backtracking/" }
    ]
  },
  {
    id: 5,
    title: "Binary Search on Answer",
    description: "When brute force is too slow, use binary search",
    topics: ["Fixed Point", "Precision Problems", "Optimization"],
    difficulty: "Medium",
    color: "blue",
    resources: [
      { name: "Codeforces Problem Set", url: "https://codeforces.com/problemset?order=RATING&tags=binary-search" },
      { name: "LeetCode Study Guide", url: "https://leetcode.com/discuss/study-guide/788511/Binary-Search-patterns" }
    ]
  },
  {
    id: 6,
    title: "String Algorithms",
    description: "KMP, Trie, Suffix Arrays, Z-algorithm",
    topics: ["Pattern Matching", "Tries", "String Hashing", "Suffix Array"],
    difficulty: "Hard",
    color: "red",
    resources: [
      { name: "Trie Visualizer", url: "https://www.cs.usfca.edu/~galles/visualization/Trie.html" },
      { name: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf" }
    ]
  }
];

const learningPaths = [
  {
    id: 1,
    title: "Beginner Track",
    description: "Complete journey from zero to competitive programmer",
    duration: "6-8 weeks",
    level: "Complete Beginner",
    topics: ["Arrays", "Strings", "Sorting", "Basic Math", "Brute Force"]
  },
  {
    id: 2,
    title: "Intermediate Track",
    description: "Master essential data structures and algorithms",
    duration: "12-16 weeks",
    level: "6 months experience",
    topics: ["Trees", "Graphs", "DP", "Binary Search", "Bit Manipulation"]
  },
  {
    id: 3,
    title: "Advanced Track",
    description: "Prepare for ICPC, Codeforces Div. 1, and top-rated contests",
    duration: "Ongoing",
    level: "Expert",
    topics: ["Advanced Graphs", "String Algorithms", "Geometry", "Game Theory", "Heavy DP"]
  }
];

const platforms = [
  {
    name: "Codeforces",
    description: "The gold standard for competitive programming practice with official contests",
    url: "https://codeforces.com",
    level: "All Levels",
    specialties: ["Live Contests", "Problem Set", "Gym", "Educational Rounds", "div1/div2/div3"]
  },
  {
    name: "LeetCode",
    description: "Great for interview prep and weekly practice contests",
    url: "https://leetcode.com",
    level: "Beginner-Medium",
    specialties: ["Daily Challenge", "Top Interview Qs", "Weekly Contests"]
  },
  {
    name: "AtCoder",
    description: "Japanese platform with high-quality problems",
    url: "https://atcoder.jp",
    level: "Medium-Hard",
    specialties: ["ABC/ARC/AGC contests", "Hard problems", "Educational DP"]
  },
  {
    name: "CSES Problem Set",
    description: "Classic problem collection with step-by-step solutions",
    url: "https://cses.fi/problemset/",
    level: "Intermediate",
    specialties: ["Sorting", "Graph", "Dynamic Programming", "String Algorithms"]
  },
  {
    name: "USACO Guide",
    description: "Comprehensive training guide with curated problems",
    url: "https://usaco.guide/",
    level: "All Levels",
    specialties: ["Bronze/Silver/Gold/Platinum", "Detailed explanations", "Practice problems"]
  },
  {
    name: "HackerRank",
    description: "Practice domains with structured tracks",
    url: "https://www.hackerrank.com/",
    level: "Beginner-Intermediate",
    specialties: ["Algorithms", "Data Structures", "SQL", "Interview Prep"]
  }
];

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "beginner":
    case "easy":
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
    case "easy-medium":
    case "medium":
      return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20";
    case "medium-hard":
    case "hard":
      return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
  }
}

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <div className="bg-white dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Practice & Learning
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Master data structures and algorithms with curated resources that lead to external practice platforms.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">12</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Topics</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">50+</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Resources</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">3</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Learning Paths</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5+</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Platforms</div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-16">
          <SectionHeader icon="🗺️" title="Learning Paths" subtitle="Structured journeys to master competitive programming" />

          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div key={path.id} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all bg-white dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{path.title}</h3>
                <div className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold mb-3 ${
                  path.level === "Complete Beginner" ? "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400" :
                  path.level === "6 months experience" ? "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400" :
                  "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  {path.level}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{path.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{path.duration}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{path.topics.length} topics</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                  {path.topics.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Structures */}
        <div className="mb-16">
          <SectionHeader icon="📦" title="Data Structures" subtitle="Essential building blocks for problem solving" />

          <div className="grid md:grid-cols-2 gap-4">
            {dataStructures.map((ds) => (
              <div key={ds.id} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ds.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${getDifficultyColor(ds.difficulty)}`}>
                    {ds.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{ds.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ds.topics.map((topic, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {ds.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
                    >
                      {resource.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithms */}
        <div className="mb-16">
          <SectionHeader icon="⚙️" title="Algorithms" subtitle="Powerful techniques to solve complex problems efficiently" />

          <div className="grid md:grid-cols-2 gap-4">
            {algorithms.map((algo) => (
              <div key={algo.id} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{algo.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${getDifficultyColor(algo.difficulty)}`}>
                    {algo.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{algo.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {algo.topics.map((topic, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {algo.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
                    >
                      {resource.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Platforms */}
        <div className="mb-16">
          <SectionHeader icon="🌐" title="Practice Platforms" subtitle="External resources to test your skills" />

          <div className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="p-5 rounded-2xl border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10 dark:bg-gray-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{platform.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{platform.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded font-semibold">{platform.level}</span>
                      {platform.specialties.map((specialty) => (
                        <span key={specialty} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>💡</span> Practice Tips
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Daily Routine</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Solve 2-3 problems daily</li>
                  <li>• Focus on one topic at a time</li>
                  <li>• Keep a problem-solving journal</li>
                  <li>• Review wrong submissions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Contest Strategy</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Read all problems first</li>
                  <li>• Start with easier ones</li>
                  <li>• Mock contests regularly</li>
                  <li>• Analyze after each contest</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-3xl font-bold mb-2">Ready to Start Practicing?</h2>
          <p className="text-blue-100 mb-6">Pick a topic and dive into practice using the external resources above</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contests" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
              View Contests
            </Link>
            <Link href="/about" className="px-6 py-3 bg-transparent border-2 border-white font-bold rounded-lg hover:bg-white/10 transition-colors">
              How It Works
            </Link>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Note:</strong> These resources redirect to external platforms. We're providing curated links to help
            you practice efficiently. ContestRadar doesn't host problems or judge submissions.
          </p>
        </div>

      </div>
    </div>
  );
}