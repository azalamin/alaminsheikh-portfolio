"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clapperboard,
  FolderKanban,
  Quote,
  Sparkles,
  Mail,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/videos", label: "Videos", icon: Clapperboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/users", label: "Editors", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-4">
        <span className="text-lg font-semibold">Admin</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                      render={<Link href={link.href} />}
                    >
                      <link.icon />
                      <span>{link.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
