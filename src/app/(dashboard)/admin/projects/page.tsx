import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { listProjects } from "@/services/content-service";
import { deleteProjectAction, toggleProjectPublishedAction } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/content/delete-button";
import { ActionButton } from "@/components/dashboard/action-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Projects</h1>
        <Button render={<Link href="/admin/projects/new" />}>New project</Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No case studies yet"
          description="Add a project to feature it on the public portfolio."
          action={
            <Button render={<Link href="/admin/projects/new" />} variant="outline" size="sm">
              New project
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="font-medium hover:underline"
                    >
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.slug}</TableCell>
                  <TableCell className="flex gap-1">
                    <Badge variant={project.published ? "default" : "secondary"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                    {project.featured && <Badge variant="outline">Featured</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.order}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <ActionButton
                      action={toggleProjectPublishedAction.bind(
                        null,
                        project.id,
                        project.published
                      )}
                      successMessage={project.published ? "Project unpublished." : "Project published."}
                      variant="ghost"
                      size="sm"
                    >
                      {project.published ? "Unpublish" : "Publish"}
                    </ActionButton>
                    <DeleteButton
                      action={deleteProjectAction.bind(null, project.id)}
                      itemLabel={project.title}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
