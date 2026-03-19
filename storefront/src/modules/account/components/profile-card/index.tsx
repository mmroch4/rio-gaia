"use client"

import { updateCustomer } from "@/lib/data/customer"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"
import { clx, toast } from "@medusajs/ui"
import { useState } from "react"

const ProfileCard = ({ customer }: { customer: B2BCustomer }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { first_name, last_name, phone } = customer

  const [customerData, setCustomerData] = useState({
    first_name,
    last_name,
    phone,
  } as HttpTypes.StoreUpdateCustomer)

  const handleSave = async () => {
    setIsSaving(true)
    await updateCustomer(customerData).catch(() => {
      toast.error("Erro ao atualizar cliente")
    })
    setIsSaving(false)
    setIsEditing(false)

    toast.success("Cliente atualizado")
  }

  return (
    <div className="h-fit">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form
          className={clx(
            "grid grid-cols-2 gap-4 border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out",
            {
              "max-h-[244px] opacity-100 p-4": isEditing,
              "max-h-0 opacity-0": !isEditing,
            }
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSave()
            }
          }}
        >
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Primeiro Nome</label>
            <Input
              label="Primeiro Nome"
              name="first_name"
              value={customerData.first_name}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  first_name: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Último Nome</label>
            <Input
              label="Último Nome"
              name="last_name"
              value={customerData.last_name}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  last_name: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Email</label>
            <p className="text-gray-600">{customer.email}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Telefone</label>
            <Input
              label="Telefone"
              name="phone"
              value={customerData.phone}
              onChange={(e) =>
                setCustomerData({ ...customerData, phone: e.target.value })
              }
            />
          </div>
        </form>
        <div
          className={clx(
            "grid grid-cols-2 gap-4 border-b border-gray-200 transition-all duration-300 ease-in-out",
            {
              "opacity-0 max-h-0": isEditing,
              "opacity-100 max-h-[214px] p-4": !isEditing,
            }
          )}
        >
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Primeiro Nome</label>
            <p className="text-gray-600">{customer.first_name}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Último Nome</label>
            <p className="text-gray-600">{customer.last_name}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Email</label>
            <p className="text-gray-600">{customer.email}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Telefone</label>
            <p className="text-gray-600">{customer.phone}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 bg-gray-50 p-4">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Guardar
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
