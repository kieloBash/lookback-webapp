import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, { message: "Please provide a name!" }),
  icon: z.string().min(1, { message: "Please provide an icon!" }),
  description: z.optional(z.string()),
});
