import Link from "next/link";
import { Wallet, Clapperboard, Hourglass, CircleDollarSign } from "lucide-react";
import { getSession } from "@/lib/guards";
import { getEditorOverviewStats } from "@/services/dashboard-service";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditorOverviewPage() {
  const session = await getSession();
  const stats = await getEditorOverviewStats(session!.user.id);

  const cards = [
    {
      label: "Total earnings",
      value: formatCurrency(stats.totalEarnings),
      icon: Wallet,
      href: "/editor/videos",
    },
    {
      label: "Pending payout",
      value: formatCurrency(stats.pendingPayout),
      icon: CircleDollarSign,
      href: "/editor/videos",
    },
    {
      label: "Videos worked on",
      value: stats.totalVideos.toString(),
      icon: Clapperboard,
      href: "/editor/videos",
    },
    {
      label: "Pending videos",
      value: stats.pendingVideos.toString(),
      icon: Hourglass,
      href: "/editor/videos",
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
