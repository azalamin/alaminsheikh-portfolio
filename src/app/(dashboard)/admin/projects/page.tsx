import Link from "next/link";
import { listProjects } from "@/services/content-service";
import { deleteProjectAction, toggleProjectPublishedAction } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/content/delete-button";
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
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button render={<Link href="/admin/projects/new" />}>New project</Button>
      </div>

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
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No projects yet.
                </TableCell>
              </TableRow>
            )}
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link href={`/admin/projects/${project.id}`} className="font-medium hover:underline">
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
                <TableCell>{project.order}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <form
                    action={toggleProjectPublishedAction.bind(null, project.id, project.published)}
                  >
                    <Button type="submit" variant="ghost" size="sm">
                      {project.published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>
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
    </div>
  );
}
