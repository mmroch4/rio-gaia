"use client"

import { StatusBadge } from "@medusajs/ui"

const StatusTitles: Record<string, string> = {
  accepted: "Aceite",
  customer_rejected: "Rejeitado",
  merchant_rejected: "Rejeitado pelo Comerciante",
  pending_merchant: "Pendente (Comerciante)",
  pending_customer: "Pendente (Cliente)",
}

const StatusColors: Record<string, "green" | "orange" | "red" | "blue"> = {
  accepted: "green",
  customer_rejected: "red",
  merchant_rejected: "red",
  pending_merchant: "orange",
  pending_customer: "orange",
}

export default function QuoteStatusBadge({ status }: { status: string }) {
  return (
    <StatusBadge color={StatusColors[status]}>
      {StatusTitles[status]}
    </StatusBadge>
  )
}
