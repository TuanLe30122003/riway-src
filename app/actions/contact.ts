"use server";

import { contactSchema, type ContactValues } from "@/lib/contact-schema";

export type ContactResult = { ok: true } | { ok: false; error: "invalid" | "server" };

export async function submitContact(values: ContactValues): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "invalid" };

  try {
    await deliverContact(parsed.data);
    return { ok: true };
  } catch {
    return { ok: false, error: "server" };
  }
}

async function deliverContact(data: ContactValues) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[contact]", { name: data.name, email: data.email });
  }
}
