import { z } from "zod";

export const RequestSchema = z.object({
  dateOfSymptoms: z.string(),
  dateOfTesting: z.string(),
  symptoms: z.string(),
  medicalImage: z.string(),
  contactNumber: z.string().regex(/^\d{11}$/, "Invalid phone number"),
});
