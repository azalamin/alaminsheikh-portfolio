import Link from "next/link";
import { Sparkles } from "lucide-react";
import { listServices } from "@/services/content-service";
import { deleteServiceAction, toggleServicePublishedAction } from "@/actions/content";
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

export default async function AdminServicesPage() {
  const services = await listServices();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Services</h1>
        <Button render={<Link href="/admin/services/new" />} nativeButton={false}>New service</Button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No services yet"
          description="Add a service to list on the public portfolio."
          action={
            <Button render={<Link href="/admin/services/new" />} nativeButton={false} variant="outline" size="sm">
              New service
            </Button>
          }
        />
      ) : (
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
                  <TableCell className="text-muted-foreground">{service.order}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <ActionButton
                      action={toggleServicePublishedAction.bind(
                        null,
                        service.id,
                        service.published
                      )}
                      successMessage={service.published ? "Service unpublished." : "Service published."}
                      variant="ghost"
                      size="sm"
                    >
                      {service.published ? "Unpublish" : "Publish"}
                    </ActionButton>
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
      )}
    </div>
  );
}
