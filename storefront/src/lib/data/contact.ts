"use server"

import { sdk } from "@/lib/config"

export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  return sdk.client.fetch<{ success: boolean }>(`/store/contact`, {
    method: "POST",
    body: data,
  })
}
