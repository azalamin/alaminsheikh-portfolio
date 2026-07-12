import { redirect } from "next/navigation";
import { getSession } from "@/lib/guards";
import { EditorSidebar } from "@/components/dashboard/editor-sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.user.role !== "editor" && session.user.role !== "admin")) {
    redirect("/login");
  }

  if (session.user.mustChangePassword) {
    redirect("/change-password");
  }

  return (
    <SidebarProvider>
      <EditorSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground">Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu name={session.user.name} email={session.user.email} />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
