"use client"

import { requestPasswordReset } from "@/lib/data/customer"
import Button from "@/modules/common/components/button"
import { B2BCustomer } from "@/types"
import { toast } from "@medusajs/ui"
import { useState } from "react"

const SecurityCard = ({ customer }: { customer: B2BCustomer }) => {
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)

    // Create FormData from the form element
    const formData = new FormData(e.currentTarget)

    // Ensure email is present
    if (!formData.get("email")) {
      formData.append("email", customer.email)
    }

    const response = await requestPasswordReset(null, formData)

    setIsSending(false)

    if (typeof response === 'object' && response.success) {
      toast.success("Email de redefinição enviado com sucesso")
    } else {
      toast.error(typeof response === 'string' ? response : "Erro ao enviar email")
    }
  }

  return (
    <div className="h-fit">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 p-4">
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Palavra-passe</label>
            <p className="text-gray-600">***************</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 bg-gray-50 p-4">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="email" value={customer.email} readOnly />
            <Button
              variant="secondary"
              type="submit"
              isLoading={isSending}
            >
              Alterar palavra-passe
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SecurityCard
