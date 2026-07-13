import Link from "next/link";
import { Clapperboard, Wallet, Mail } from "lucide-react";
import { getAdminOverviewStats } from "@/services/dashboard-service";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  const cards = [
    {
      label: "Active videos",
      value: stats.activeVideos.toString(),
      icon: Clapperboard,
      href: "/admin/videos",
    },
    {
      label: "Unpaid amount",
      value: formatCurrency(stats.unpaidAmount),
      icon: Wallet,
      href: "/admin/videos",
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
