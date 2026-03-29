"use client"

import { setShippingAddress } from "@/lib/data/cart"
import ErrorMessage from "@/modules/checkout/components/error-message"
import Button from "@/modules/common/components/button"
import Divider from "@/modules/common/components/divider"
import Radio from "@/modules/common/components/radio"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Spinner from "@/modules/common/icons/spinner"
import { B2BCart, B2BCustomer } from "@/types"
import { QueryCompany, ModuleCompanyAddress } from "@/types/company"
import { CheckCircleSolid, Plus } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

const QuoteShippingAddress = ({
  cart,
  customer,
  company,
}: {
  cart: B2BCart | null
  customer: B2BCustomer | null
  company: QueryCompany
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [error, setError] = useState<string | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = searchParams.get("step") === "shipping-address"
  const addresses = company.addresses || []

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(
      pathname + "?" + createQueryString("step", "shipping-address"),
      { scroll: false }
    )
  }

  const handleSubmit = async () => {
    setError(null)

    const selected = addresses.find((a) => a.id === selectedAddressId)
    if (!selected) {
      setError("Selecione uma morada de envio.")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set("shipping_address.first_name", selected.first_name || selected.company_name)
      formData.set("shipping_address.last_name", selected.last_name || "")
      formData.set("shipping_address.company", selected.company_name)
      formData.set("shipping_address.address_1", selected.address_1)
      formData.set("shipping_address.postal_code", selected.postal_code)
      formData.set("shipping_address.city", selected.city)
      formData.set("shipping_address.province", selected.province || "")
      formData.set("shipping_address.country_code", selected.country_code)
      formData.set("shipping_address.phone", selected.phone || "")
      formData.set("email", customer?.email || "")

      await setShippingAddress(formData)
      router.push(
        pathname + "?" + createQueryString("step", "billing-address"),
        { scroll: false }
      )
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-2">
        {customer?.email && (
          <div className="flex items-center gap-x-2 py-2 px-1 text-sm text-ui-fg-subtle">
            <span className="font-medium">Email:</span>
            <span>{customer.email}</span>
          </div>
        )}

        <div className="flex flex-row items-center justify-between w-full">
          <Heading
            level="h2"
            className="flex flex-row text-xl gap-x-2 items-center"
          >
            Morada de Entrega
            {!isOpen && cart?.shipping_address?.address_1 && (
              <CheckCircleSolid />
            )}
          </Heading>

          {!isOpen && cart?.shipping_address?.address_1 && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Editar
              </button>
            </Text>
          )}
        </div>
        <Divider />
        {isOpen ? (
          <div className="pb-8">
            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-y-4 text-center">
                <Text className="text-ui-fg-muted">
                  A sua empresa nao tem moradas de envio registadas.
                </Text>
                <LocalizedClientLink href="/portal/conta/moradas">
                  <button className="flex items-center gap-x-2 rounded-full bg-ui-bg-interactive px-5 py-2.5 text-sm font-medium text-ui-fg-on-color hover:bg-ui-bg-interactive-hover transition-colors">
                    <Plus className="w-4 h-4" />
                    Adicionar morada de envio
                  </button>
                </LocalizedClientLink>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-y-3 py-4">
                  {addresses.map((address) => (
                    <AddressOption
                      key={address.id}
                      address={address}
                      selected={selectedAddressId === address.id}
                      onSelect={() => setSelectedAddressId(address.id)}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-y-2 items-end">
                  <Button
                    className="mt-2 h-10 rounded-full"
                    onClick={handleSubmit}
                    disabled={!selectedAddressId || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Continuar
                  </Button>
                  <ErrorMessage error={error} />
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="text-small-regular">
              {cart && cart.shipping_address?.address_1 ? (
                <div className="flex items-start gap-x-8">
                  <div className="flex">
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name},{" "}
                      {cart.shipping_address.address_1},{" "}
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city},{" "}
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>
                </div>
              ) : (
                <div>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

const AddressOption = ({
  address,
  selected,
  onSelect,
}: {
  address: ModuleCompanyAddress
  selected: boolean
  onSelect: () => void
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={`flex items-start gap-x-4 rounded-lg border p-4 text-left transition-colors cursor-pointer ${
        selected
          ? "border-ui-border-interactive bg-ui-bg-interactive/5"
          : "border-ui-border-base hover:bg-ui-bg-subtle"
      }`}
    >
      <Radio checked={selected} />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{address.label}</span>
        <span className="text-sm text-ui-fg-subtle">
          {address.first_name} {address.last_name}
          {address.company_name ? ` - ${address.company_name}` : ""}
        </span>
        <span className="text-sm text-ui-fg-muted">
          {address.address_1}, {address.postal_code} {address.city},{" "}
          {address.country_code?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export default QuoteShippingAddress
