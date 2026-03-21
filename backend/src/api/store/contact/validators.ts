import { z } from "zod";

export type StoreContactFormType = z.infer<typeof StoreContactForm>;

export const StoreContactForm = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(1).max(5000),
  })
  .strict();
