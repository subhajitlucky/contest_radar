import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import PracticeExplorer from "./PracticeExplorer";

export const metadata: Metadata = {
  title: "Practice - ContestRadar",
  description:
    "Structured learning paths, data structures, algorithms, and external practice platforms for competitive programming.",
};

const dataStructures = [
  {
    id: 1,
    title: "Arrays & Strings",
    description: "Basic building blocks - arrays, strings, 2D arrays",
    topics: ["Sliding Window", "Prefix Sums", "Two Pointers", "Substrings"],
    difficulty: "Beginner",
    resources: [
      { name: "Codeforces EDU - Two Pointers", url: "https://codeforces.com/edu/course/2/lesson/9" },
      { name: "LeetCode Patterns", url: "https://seanprashad.com/leetcode-patterns/" },
      { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/array-data-structure/" },
    ],
  },
  {
    id: 2,
    title: "Linked Lists",
    description: "Singly, doubly, circular linked lists and operations",
    topics: ["Fast & Slow Pointers", "Cycle Detection", "Reversal", "Merging"],
    difficulty: "Easy",
    resources: [
      { name: "VisualAlgo", url: "https://visualgo.net/en/list" },
      {
        name: "HackerRank",
        url: "https://www.hackerrank.com/domains/data-structures?filters%5Bsubdomains%5D%5B%5D=linked-lists",
      },
    ],
  },
  {
    id: 3,
    title: "Stacks & Queues",
    description: "LIFO and FIFO operations, monotonic stacks",
    topics: ["Monotonic Stack", "Custom Queue", "Infix/Postfix", "Two Stacks"],
    difficulty: "Easy",
    resources: [
      { name: "Codeforces EDU - Stack", url: "https://codeforces.com/edu/course/2/lesson/7" },
      { name: "Programiz", url: "https://www.programiz.com/dsa/stack" },
    ],
  },
  {
    id: 4,
    title: "Trees & BST",
    description: "Binary trees, BST, traversals, balanced trees",
    topics: ["DFS/BFS", "Height/Depth", "BST Validation", "Lowest Common Ancestor"],
    difficulty: "Medium",
    resources: [
      { name: "CP-Algorithms - Trees", url: "https://cp-algorithms.com/graph/tree-basics.html" },
      { name: "LeetCode Tree (Practice)", url: "https://leetcode.com/tag/tree/" },
    ],
  },
  {
    id: 5,
    title: "Graphs & Trees (Advanced)",
    description: "Graph traversals, shortest paths, connectivity",
    topics: ["BFS/DFS", "Dijkstra", "Floyd-Warshall", "Topological Sort", "Union-Find"],
    difficulty: "Hard",
    resources: [
      { name: "Codeforces EDU - Graphs", url: "https://codeforces.com/edu/course/2/lesson/6" },
      { name: "USACO Guide", url: "https://usaco.guide/bronze/" },
    ],
  },
  {
    id: 6,
    title: "Hash Tables & Sets",
    description: "Hashing, collision resolution, frequency counting",
    topics: ["Hash Maps", "Set Operations", "Two Sum", "Subarray Sum"],
    difficulty: "Easy",
    resources: [
      { name: "Codeforces Hashing", url: "https://codeforces.com/blog/entry/61159" },
      {
        name: "HackerEarth",
        url: "https://www.hackerearth.com/practice/data-structures/hash-tables/tutorial/",
      },
    ],
  },
];

const algorithms = [
  {
    id: 1,
    title: "Searching & Sorting",
    description: "Binary search, merge sort, quicksort, custom comparators",
    topics: ["Binary Search", "Two Pointers", "Merge Sort", "Heapsort"],
    difficulty: "Easy-Medium",
    resources: [
      { name: "VisualGo Sorting", url: "https://visualgo.net/en/sorting" },
      { name: "CP-Algorithms", url: "https://cp-algorithms.com/" },
      { name: "Codeforces EDU", url: "https://codeforces.com/edu/course/2" },
    ],
  },
  {
    id: 2,
    title: "Dynamic Programming",
    description: "Optimization problems with overlapping subproblems",
    topics: ["1D DP", "2D DP", "Knapsack", "LCS", "Knuth Optimization"],
    difficulty: "Hard",
    resources: [
      { name: "Codeforces DP Course", url: "https://codeforces.com/edu/course/2/lesson/7" },
      { name: "AtCoder DP Contest", url: "https://atcoder.jp/contests/dp" },
    ],
  },
  {
    id: 3,
    title: "Greedy Algorithms",
    description: "Local optimal choices leading to global optimum",
    topics: ["Activity Selection", "Fractional Knapsack", "Interval Scheduling"],
    difficulty: "Medium",
    resources: [
      { name: "GeeksforGeeks - Greedy", url: "https://www.geeksforgeeks.org/greedy-algorithms/" },
      { name: "Codeforces EDU", url: "https://codeforces.com/edu/course/2" },
    ],
  },
  {
    id: 4,
    title: "Backtracking & Recursion",
    description: "DFS-based problem solving, permutation generation",
    topics: ["N-Queens", "Subset Generation", "Permutations", "Game Theory"],
    difficulty: "Medium",
    resources: [
      { name: "CP-Algorithms - Backtracking", url: "https://cp-algorithms.com/graph/backtracking.html" },
      { name: "LeetCode Backtracking", url: "https://leetcode.com/tag/backtracking/" },
    ],
  },
  {
    id: 5,
    title: "Binary Search on Answer",
    description: "When brute force is too slow, use binary search",
    topics: ["Fixed Point", "Precision Problems", "Optimization"],
    difficulty: "Medium",
    resources: [
      {
        name: "Codeforces Problem Set",
        url: "https://codeforces.com/problemset?order=RATING&tags=binary-search",
      },
      {
        name: "LeetCode Study Guide",
        url: "https://leetcode.com/discuss/study-guide/788511/Binary-Search-patterns",
      },
    ],
  },
  {
    id: 6,
    title: "String Algorithms",
    description: "KMP, Trie, Suffix Arrays, Z-algorithm",
    topics: ["Pattern Matching", "Tries", "String Hashing", "Suffix Array"],
    difficulty: "Hard",
    resources: [
      { name: "Trie Visualizer", url: "https://www.cs.usfca.edu/~galles/visualization/Trie.html" },
      { name: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf" },
    ],
  },
];

const learningPaths = [
  {
    id: 1,
    title: "Beginner Track",
    description: "Complete journey from zero to competitive programmer",
    duration: "6-8 weeks",
    level: "Complete Beginner",
    topics: ["Arrays", "Strings", "Sorting", "Basic Math", "Brute Force"],
  },
  {
    id: 2,
    title: "Intermediate Track",
    description: "Master essential data structures and algorithms",
    duration: "12-16 weeks",
    level: "6 months experience",
    topics: ["Trees", "Graphs", "DP", "Binary Search", "Bit Manipulation"],
  },
  {
    id: 3,
    title: "Advanced Track",
    description: "Prepare for ICPC, Codeforces Div. 1, and top-rated contests",
    duration: "Ongoing",
    level: "Expert",
    topics: ["Advanced Graphs", "String Algorithms", "Geometry", "Game Theory", "Heavy DP"],
  },
];

const platforms = [
  {
    name: "Codeforces",
    description: "The gold standard for competitive programming practice with official contests",
    url: "https://codeforces.com",
    level: "All Levels",
    specialties: ["Live Contests", "Problem Set", "Gym", "Educational Rounds"],
  },
  {
    name: "LeetCode",
    description: "Great for interview prep and weekly practice contests",
    url: "https://leetcode.com",
    level: "Beginner-Medium",
    specialties: ["Daily Challenge", "Top Interview Questions", "Weekly Contests"],
  },
  {
    name: "AtCoder",
    description: "Japanese platform with high-quality problems and editorials",
    url: "https://atcoder.jp",
    level: "Medium-Hard",
    specialties: ["ABC / ARC / AGC", "Hard problems", "Educational DP"],
  },
  {
    name: "CSES Problem Set",
    description: "Classic problem collection with step-by-step solutions",
    url: "https://cses.fi/problemset/",
    level: "Intermediate",
    specialties: ["Sorting", "Graphs", "Dynamic Programming", "String Algorithms"],
  },
  {
    name: "USACO Guide",
    description: "Comprehensive training guide with curated problems",
    url: "https://usaco.guide/",
    level: "All Levels",
    specialties: ["Bronze / Silver / Gold / Platinum", "Detailed explanations"],
  },
  {
    name: "HackerRank",
    description: "Practice domains with structured tracks",
    url: "https://www.hackerrank.com/",
    level: "Beginner-Intermediate",
    specialties: ["Algorithms", "Data Structures", "SQL", "Interview Prep"],
  },
];

export default function PracticePage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Practice
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Practice with <span className="serif-accent">intent</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Follow a sequence, then go deep on one topic at a time. Every resource opens an
            external platform; ContestRadar does not host problems or judge submissions.
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
            <Stat value={String(learningPaths.length)} label="Tracks" />
            <Stat value={String(dataStructures.length + algorithms.length)} label="Modules" />
            <Stat value="50+" label="Resources" />
            <Stat value={String(platforms.length)} label="Platforms" />
          </div>
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <PracticeExplorer
          paths={learningPaths}
          dataStructures={dataStructures}
          algorithms={algorithms}
          platforms={platforms}
        />
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-2">
          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Daily routine</h2>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-muted">
              <li>Solve 2-3 problems daily.</li>
              <li>Stay on one topic until the pattern is obvious.</li>
              <li>Review wrong submissions before starting the next set.</li>
            </ul>
          </div>
          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Contest routine</h2>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-muted">
              <li>Read every problem before writing code.</li>
              <li>Start with the problem you can finish fastest.</li>
              <li>Upsolve one unsolved problem after each round.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
    </div>
  );
}
