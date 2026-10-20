const API = "https://contestradar.vercel.app/api/contests";
const COLORS = {
  codeforces: "#3b6ef5",
  leetcode: "#d98a0b",
  codechef: "#d95b2b",
  atcoder: "#8a94a0",
  hackerrank: "#22996c",
};

const list = document.getElementById("list");
const refresh = document.getElementById("refresh");

function formatTime(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRemaining(iso) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "live";
  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

function render(contests) {
  if (!contests.length) {
    list.innerHTML = '<p class="status">No upcoming contests found.</p>';
    return;
  }

  list.innerHTML = contests
    .slice(0, 5)
    .map((contest) => {
      const color = COLORS[contest.platformKey] || "#9b9b96";
      return `
        <article class="contest" style="--platform:${color}">
          <span class="dot" aria-hidden="true"></span>
          <div>
            <p class="name">${escapeHtml(contest.name)}</p>
            <p class="meta">${escapeHtml(contest.platform)} · ${formatTime(
              contest.startTime
            )} IST</p>
            <p class="meta"><span class="countdown">${formatRemaining(
              contest.startTime
            )}</span> · ${contest.duration} min</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function load() {
  list.innerHTML = '<p class="status">Loading contests…</p>';
  try {
    const response = await fetch(API, { cache: "no-store" });
    const payload = await response.json();
    render(payload.data || []);
  } catch {
    list.innerHTML =
      '<p class="status">Could not reach ContestRadar. Try again in a minute.</p>';
  }
}

refresh.addEventListener("click", load);
load();
setInterval(() => {
  chrome.storage.local.set({ lastRefresh: Date.now() });
}, 60000);
