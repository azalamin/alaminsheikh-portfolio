import Link from "next/link";
import {
  Clapperboard,
  Wallet,
  Mail,
  CircleDollarSign,
  Users,
  Hourglass,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import { getAdminOverviewStats } from "@/services/dashboard-service";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  const cards = [
    {
      label: "Total spent",
      value: formatCurrency(stats.totalSpent),
      icon: Wallet,
      href: "/admin/videos",
    },
    {
      label: "Pending payout",
      value: formatCurrency(stats.unpaidAmount),
      icon: CircleDollarSign,
      href: "/admin/videos",
    },
    {
      label: "Videos assigned",
      value: stats.assignedVideos.toString(),
      icon: Clapperboard,
      href: "/admin/videos",
    },
    {
      label: "Unassigned videos",
      value: stats.unassignedVideos.toString(),
      icon: Inbox,
      href: "/admin/videos",
    },
    {
      label: "Pending videos",
      value: stats.pendingVideos.toString(),
      icon: Hourglass,
      href: "/admin/videos",
    },
    {
      label: "Completed videos",
      value: stats.completedVideos.toString(),
      icon: CheckCircle2,
      href: "/admin/videos",
    },
    {
      label: "Active editors",
      value: stats.activeEditors.toString(),
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Unread messages",
      value: stats.unreadMessages.toString(),
      icon: Mail,
      href: "/admin/messages",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl tabular-nums">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
