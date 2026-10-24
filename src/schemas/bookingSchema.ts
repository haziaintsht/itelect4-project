


import { z } from "zod";

export const bookingSchema = z.object({
  
  sessionId: z.string().min(1, "Choose a session."),

  
  
  
  
  note: z
    .string()
    .min(1, "Tell the tutor what you need help with.")
    .min(10, "Write at least 10 characters.")
    .max(160, "Keep the note under 160 characters.")
    .refine(
      (text) => text.trim().split(/\s+/).length >= 3,
      "Write at least three words so the tutor understands what you need."
    ),
});




export type BookingFormValues = z.infer<typeof bookingSchema>;