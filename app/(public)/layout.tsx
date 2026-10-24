import Footer from "@/app/components/Footer";
import PublicHeader from "@/app/components/public/PublicHeader";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PublicHeader signedIn={Boolean(user)} />
      <main id="main" className="public-main">
        {children}
      </main>
      <Footer mobileNav={false} />
    </>
  );
}
