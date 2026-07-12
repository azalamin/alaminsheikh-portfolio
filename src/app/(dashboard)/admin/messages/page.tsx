import { listContactSubmissions } from "@/services/contact-service";
import { markContactReadAction } from "@/actions/contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminMessagesPage() {
  const submissions = await listContactSubmissions();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Messages</h1>

      {submissions.length === 0 && (
        <p className="text-sm text-muted-foreground">No contact submissions yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {submission.name} <span className="text-muted-foreground font-normal">· {submission.email}</span>
                </CardTitle>
                {!submission.read && <Badge>Unread</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {submission.createdAt.toLocaleString()}
                </span>
                {!submission.read && (
                  <form action={markContactReadAction.bind(null, submission.id)}>
                    <Button type="submit" variant="outline" size="sm">
                      Mark as read
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
