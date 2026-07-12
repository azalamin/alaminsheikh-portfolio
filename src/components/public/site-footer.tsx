import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Al Amin Sheikh. All rights reserved.</p>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/#work" className="hover:text-foreground">
            Work
          </Link>
          <Link href="/#contact" className="hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
