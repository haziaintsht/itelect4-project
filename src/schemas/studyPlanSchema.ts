import { z } from "zod";

// Same limits as aiRequestSchema on the backend, checked here first so the
// student sees the problem instantly instead of after a round trip.
export const studyPlanSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Write at least 20 characters so the planner has enough to work with.")
    .max(2000, "Keep it under 2000 characters."),
});

export type StudyPlanFormValues = z.infer<typeof studyPlanSchema>;
