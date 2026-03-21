"use server"

import { sdk } from "@/lib/config"
import {
  getRateLimitMessage,
  isRateLimitError,
} from "@/lib/util/rate-limit-error"

export type ContactFormResult =
  | { success: true }
  | { success: false; rateLimited: true; message: string }
  | { success: false; rateLimited: false }

export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<ContactFormResult> {
  try {
    await sdk.client.fetch<{ success: boolean }>(`/store/contact`, {
      method: "POST",
      body: data,
    })
    return { success: true }
  } catch (error) {
    if (isRateLimitError(error)) {
      return {
        success: false,
        rateLimited: true,
        message: getRateLimitMessage(error),
      }
    }
    return { success: false, rateLimited: false }
  }
}
