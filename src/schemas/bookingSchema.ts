// src/schemas/bookingSchema.ts
// One schema. The rules live here, and the TypeScript type is DERIVED
// from it -- so a rule and its type can never drift apart.
import { z } from "zod";

export const bookingSchema = z.object({
  // .min(1) is what "required" means for a string: not empty.
  sessionId: z.string().min(1, "Choose a session."),

  // Required, then a max -- then .refine() adds any rule Zod does not
  // ship: yours, as a function.
  note: z
    .string()
    .min(1, "Tell the tutor what you need help with.")
    .max(160, "Keep the note under 160 characters.")
    .refine(
      (text) => text.trim().split(/\s+/).length >= 3,
      "Write at least three words so the tutor understands what you need."
    ),
});

// z.infer reads the schema and hands back the TypeScript type:
//   { sessionId: string; note: string }
// Written by hand, that type would be a second thing to keep in sync.
export type BookingFormValues = z.infer<typeof bookingSchema>;