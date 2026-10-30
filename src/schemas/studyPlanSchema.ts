import { z } from "zod";

export const studyPlanSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Write at least 20 characters so the planner has enough to work with.")
    .max(2000, "Keep it under 2000 characters."),
});

export type StudyPlanFormValues = z.infer<typeof studyPlanSchema>;
