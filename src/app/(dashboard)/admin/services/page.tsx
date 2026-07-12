import Link from "next/link";
import { listServices } from "@/services/content-service";
import { deleteServiceAction, toggleServicePublishedAction } from "@/actions/content";
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

export default async function AdminServicesPage() {
  const services = await listServices();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Services</h1>
        <Button render={<Link href="/admin/services/new" />}>New service</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No services yet.
                </TableCell>
              </TableRow>
            )}
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="font-medium hover:underline"
                  >
                    {service.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={service.published ? "default" : "secondary"}>
                    {service.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{service.order}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <form
                    action={toggleServicePublishedAction.bind(
                      null,
                      service.id,
                      service.published
                    )}
                  >
                    <Button type="submit" variant="ghost" size="sm">
                      {service.published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>
                  <DeleteButton
                    action={deleteServiceAction.bind(null, service.id)}
                    itemLabel={service.title}
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
