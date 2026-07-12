import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/guards";
import { SignOutButton } from "@/components/sign-out-button";

const navLinks = [
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/users", label: "Editors" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  if (session.user.mustChangePassword) {
    redirect("/change-password");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6">
            <span className="font-semibold">Admin</span>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/change-password" className="text-sm text-muted-foreground hover:text-foreground">
              {session.user.name}
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
