import { redirect } from "next/navigation";
import CommandPalette from "@/app/components/CommandPalette";
import Footer from "@/app/components/Footer";
import MobileNav from "@/app/components/MobileNav";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/TopBar";
import { getSessionUser } from "@/lib/auth";
import { getUpcomingContests } from "@/lib/contestSchedule";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const contests = await getUpcomingContests();
  const nextContest =
    contests.find((contest) => !/weekday|beta|trial|practice/i.test(contest.name)) ??
    contests[0] ??
    null;

  return (
    <>
      <CommandPalette />
      <Sidebar nextContest={nextContest} />
      <div className="app-main-wrap flex min-h-screen flex-col lg:pl-[276px]">
        <TopBar />
        <main className="app-main min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
        <Footer />
      </div>
      <MobileNav />
    </>
  );
}
