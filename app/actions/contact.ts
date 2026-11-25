"use server";

import { CONTACT_INFO } from "@/constants/navigation";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { SITE_NAME } from "@/lib/site";

export type ContactResult = { ok: true } | { ok: false; error: "invalid" | "server" };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function submitContact(values: ContactValues): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "invalid" };
  if (parsed.data.website) return { ok: true };

  try {
    await deliverContact(parsed.data);
    return { ok: true };
  } catch (error) {
    console.error("[contact]", error instanceof Error ? error.message : error);
    return { ok: false, error: "server" };
  }
}

async function deliverContact({ name, email, message }: ContactValues) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact]", { name, email, message });
      return;
    }
    throw new Error("RESEND_API_KEY is not set");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || `${SITE_NAME} <no-reply@riwaymedia.com>`,
      to: (process.env.CONTACT_TO_EMAIL || CONTACT_INFO.email).split(",").map((item) => item.trim()),
      reply_to: email,
      subject: `New contact message from ${name}`,
      text: `Name / Company: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}
