import { z } from "zod";

export const RequestSchema = z.object({
  dateOfSymptoms: z.string(),
  dateOfTesting: z.string(),
  symptoms: z.string(),
  medicalImage: z.string(),
});
