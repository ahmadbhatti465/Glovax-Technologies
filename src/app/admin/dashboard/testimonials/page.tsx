"use client";

import CrudManager, { FieldDef } from "@/components/admin/CrudManager";

const fields: FieldDef[] = [
  { key: "id", label: "ID", type: "text", required: true },
  { key: "content", label: "Content", type: "textarea", required: true },
  { key: "author", label: "Author", type: "text", required: true },
  { key: "role", label: "Role", type: "text", required: true },
  { key: "company", label: "Company", type: "text", required: true },
  { key: "rating", label: "Rating", type: "number", required: true },
  { key: "avatar", label: "Avatar", type: "image" },
  { key: "country", label: "Country", type: "text" },
  { key: "countryCode", label: "Country Code (2-letter, e.g. PK)", type: "text" },
  { key: "linkedin", label: "LinkedIn URL", type: "text" },
  { key: "projectType", label: "Project Type (e.g. SaaS Platform)", type: "text" },
];

export default function TestimonialsAdmin() {
  return <CrudManager title="Testimonials" apiEndpoint="/api/admin/testimonials" fields={fields} />;
}
