import Link from "next/link";
import { Quote } from "lucide-react";
import { listTestimonials } from "@/services/content-service";
import { deleteTestimonialAction, toggleTestimonialPublishedAction } from "@/actions/content";
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

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonials();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Testimonials</h1>
        <Button render={<Link href="/admin/testimonials/new" />}>New testimonial</Button>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Add a client quote to build trust on the public portfolio."
          action={
            <Button render={<Link href="/admin/testimonials/new" />} variant="outline" size="sm">
              New testimonial
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <Link
                      href={`/admin/testimonials/${testimonial.id}`}
                      className="font-medium hover:underline"
                    >
                      {testimonial.clientName}
                    </Link>
                    {testimonial.clientRole && (
                      <span className="text-muted-foreground"> · {testimonial.clientRole}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{testimonial.rating}/5</TableCell>
                  <TableCell>
                    <Badge variant={testimonial.published ? "default" : "secondary"}>
                      {testimonial.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <ActionButton
                      action={toggleTestimonialPublishedAction.bind(
                        null,
                        testimonial.id,
                        testimonial.published
                      )}
                      successMessage={
                        testimonial.published ? "Testimonial unpublished." : "Testimonial published."
                      }
                      variant="ghost"
                      size="sm"
                    >
                      {testimonial.published ? "Unpublish" : "Publish"}
                    </ActionButton>
                    <DeleteButton
                      action={deleteTestimonialAction.bind(null, testimonial.id)}
                      itemLabel={testimonial.clientName}
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
