"use client";

import { useState } from "react";
import { banEditorAction, unbanEditorAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BanEditorButton({ userId, name }: { userId: string; name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm">Deactivate</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate {name}?</DialogTitle>
          <DialogDescription>
            They won&apos;t be able to log in. Their historical records are kept.
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await banEditorAction(userId, String(formData.get("reason") ?? ""));
            setOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea id="reason" name="reason" rows={2} />
          </div>
          <DialogFooter>
            <Button type="submit" variant="destructive">
              Deactivate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UnbanEditorButton({ userId }: { userId: string }) {
  return (
    <form action={unbanEditorAction.bind(null, userId)}>
      <Button type="submit" variant="ghost" size="sm">
        Reactivate
      </Button>
    </form>
  );
}
