import { listEditorAccounts } from "@/services/user-service";
import { CreateEditorForm } from "@/components/content/create-editor-form";
import { BanEditorButton, UnbanEditorButton } from "@/components/content/editor-ban-controls";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default async function AdminUsersPage() {
  const editors = await listEditorAccounts();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Editors</h1>

      <div>
        <h2 className="text-lg font-medium mb-4">Add an editor</h2>
        <CreateEditorForm />
      </div>

      <Separator />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editors.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No editors yet.
                </TableCell>
              </TableRow>
            )}
            {editors.map((editor) => (
              <TableRow key={editor.id}>
                <TableCell className="font-medium">{editor.name}</TableCell>
                <TableCell className="text-muted-foreground">{editor.email}</TableCell>
                <TableCell>
                  <Badge variant={editor.banned ? "destructive" : "default"}>
                    {editor.banned ? "Deactivated" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {editor.banned ? (
                    <UnbanEditorButton userId={editor.id} />
                  ) : (
                    <BanEditorButton userId={editor.id} name={editor.name} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
