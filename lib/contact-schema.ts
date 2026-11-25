import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.string().trim().pipe(z.email("email")),
  message: z.string().trim().min(10, "message").max(3000, "message"),
  website: z.string().optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
