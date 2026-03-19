import { z } from "zod"

export const ResetPasswordRequest = z.object({
  identifier: z.string(),
  metadata: z.record(z.unknown()).optional().default({}),
}).strict()

export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequest>