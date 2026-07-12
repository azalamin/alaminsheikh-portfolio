"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guards";
import { projectSchema } from "@/lib/validations/project";
import { testimonialSchema } from "@/lib/validations/testimonial";
import { serviceSchema } from "@/lib/validations/service";
import {
  createProject,
  updateProject,
  deleteProject,
  setProjectPublished,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  setTestimonialPublished,
  createService,
  updateService,
  deleteService,
  setServicePublished,
} from "@/services/content-service";

export type ContentFormState = { error: string } | { success: true } | undefined;

// Projects

function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    techStack: formData.get("techStack"),
    liveUrl: formData.get("liveUrl"),
    featured: formData.get("featured"),
    published: formData.get("published"),
    order: formData.get("order"),
  });
}

export async function createProjectAction(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  await createProject(parsed.data);
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProjectAction(
  id: string,
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  await updateProject(id, parsed.data);
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProject(id);
  revalidatePath("/admin/projects");
}

export async function toggleProjectPublishedAction(id: string, current: boolean) {
  await requireAdmin();
  await setProjectPublished(id, !current);
  revalidatePath("/admin/projects");
}

// Testimonials

function parseTestimonialForm(formData: FormData) {
  return testimonialSchema.safeParse({
    clientName: formData.get("clientName"),
    clientRole: formData.get("clientRole"),
    content: formData.get("content"),
    rating: formData.get("rating"),
    published: formData.get("published"),
  });
}

export async function createTestimonialAction(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  await createTestimonial(parsed.data);
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function updateTestimonialAction(
  id: string,
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  await updateTestimonial(id, parsed.data);
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonialAction(id: string) {
  await requireAdmin();
  await deleteTestimonial(id);
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonialPublishedAction(id: string, current: boolean) {
  await requireAdmin();
  await setTestimonialPublished(id, !current);
  revalidatePath("/admin/testimonials");
}

// Services

function parseServiceForm(formData: FormData) {
  return serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    published: formData.get("published"),
    order: formData.get("order"),
  });
}

export async function createServiceAction(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();
  const parsed = parseServiceForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  await createService(parsed.data);
  revalidatePath("/admin/services");
  return { success: true };
}

export async function updateServiceAction(
  id: string,
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();
  const parsed = parseServiceForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  await updateService(id, parsed.data);
  revalidatePath("/admin/services");
  return { success: true };
}

export async function deleteServiceAction(id: string) {
  await requireAdmin();
  await deleteService(id);
  revalidatePath("/admin/services");
}

export async function toggleServicePublishedAction(id: string, current: boolean) {
  await requireAdmin();
  await setServicePublished(id, !current);
  revalidatePath("/admin/services");
}
