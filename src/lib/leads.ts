import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import type { EmailResult } from "@/lib/email";
import { reportError } from "@/lib/monitoring";

type NewLead = Omit<typeof leads.$inferInsert, "id" | "emailStatus" | "emailError" | "createdAt">;

export async function saveLead(lead: NewLead) {
  const id = randomUUID();
  await db.insert(leads).values({ ...lead, id });
  return id;
}

/** The lead is already safe by now, so a failure here is only logged. */
export async function recordEmailOutcome(id: string, result: EmailResult) {
  try {
    await db
      .update(leads)
      .set({
        emailStatus: result.status,
        emailError: result.status === "failed" ? result.error.slice(0, 500) : null,
      })
      .where(eq(leads.id, id));
  } catch (error) {
    await reportError("Failed to record a lead's email status", error);
  }
}
