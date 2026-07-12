import { prisma } from "@/lib/prisma";
import type { ProjectInput } from "@/lib/validations/project";
import type { TestimonialInput } from "@/lib/validations/testimonial";
import type { ServiceInput } from "@/lib/validations/service";

// Projects (case studies)

export function listProjects() {
  return prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export function createProject(data: ProjectInput) {
  return prisma.project.create({ data });
}

export function updateProject(id: string, data: ProjectInput) {
  return prisma.project.update({ where: { id }, data });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export function setProjectPublished(id: string, published: boolean) {
  return prisma.project.update({ where: { id }, data: { published } });
}

// Testimonials

export function listTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export function getTestimonialById(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}

export function createTestimonial(data: TestimonialInput) {
  return prisma.testimonial.create({ data });
}

export function updateTestimonial(id: string, data: TestimonialInput) {
  return prisma.testimonial.update({ where: { id }, data });
}

export function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}

export function setTestimonialPublished(id: string, published: boolean) {
  return prisma.testimonial.update({ where: { id }, data: { published } });
}

// Services

export function listServices() {
  return prisma.service.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export function createService(data: ServiceInput) {
  return prisma.service.create({ data });
}

export function updateService(id: string, data: ServiceInput) {
  return prisma.service.update({ where: { id }, data });
}

export function deleteService(id: string) {
  return prisma.service.delete({ where: { id } });
}

export function setServicePublished(id: string, published: boolean) {
  return prisma.service.update({ where: { id }, data: { published } });
}
