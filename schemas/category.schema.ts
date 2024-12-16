import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, { message: "Please provide!" }),
  description: z.optional(z.string()),
});
