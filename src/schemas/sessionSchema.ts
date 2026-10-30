import { z } from "zod";
import { SessionType } from "../types/index";

export const sessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Give the session a title.")
    .max(80, "Keep the title under 80 characters."),
  subject: z
    .string()
    .trim()
    .min(2, "Add the subject, e.g. Calculus.")
    .max(40, "Keep the subject under 40 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Describe what the session covers in at least 10 characters.")
    .max(500, "Keep the description under 500 characters."),
  sessionType: z.enum(SessionType),
  meetingLink: z
    .string()
    .trim()
    .refine(
      (link) => link === "" || /^https?:\/\/\S+$/.test(link),
      "Paste the full link, starting with https://"
    ),
});

export type SessionFormValues = z.infer<typeof sessionSchema>;
