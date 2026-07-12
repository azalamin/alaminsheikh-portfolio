import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/guards";
import { SignOutButton } from "@/components/sign-out-button";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.user.role !== "editor" && session.user.role !== "admin")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6">
            <Link href="/editor" className="font-semibold">
              My videos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
