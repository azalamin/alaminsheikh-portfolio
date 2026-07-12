import { Mail } from "lucide-react";
import { listContactSubmissions } from "@/services/contact-service";
import { markContactReadAction } from "@/actions/contact";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/dashboard/action-button";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function AdminMessagesPage() {
  const submissions = await listContactSubmissions();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-2xl">Messages</h1>

      {submissions.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages yet"
          description="Submissions from the public contact form will show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {submission.name}{" "}
                    <span className="text-muted-foreground font-normal">
                      · {submission.email}
                    </span>
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
                    <ActionButton
                      action={markContactReadAction.bind(null, submission.id)}
                      successMessage="Marked as read."
                      variant="outline"
                      size="sm"
                    >
                      Mark as read
                    </ActionButton>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
