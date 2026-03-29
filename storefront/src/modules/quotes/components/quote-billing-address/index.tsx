"use client"

import { setBillingAddress } from "@/lib/data/cart"
import BillingAddressForm from "@/modules/checkout/components/billing-address-form"
import ErrorMessage from "@/modules/checkout/components/error-message"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Divider from "@/modules/common/components/divider"
import { B2BCart, B2BCustomer } from "@/types"
import { QueryCompany } from "@/types/company"
import { CheckCircleSolid } from "@medusajs/icons"
import { clx, Container, Heading, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

const QuoteBillingAddress = ({
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

  const isOpen = searchParams.get("step") === "billing-address"

  // Portuguese B2B convention: billing name = company legal name
  const companyBillingData = useMemo(() => {
    if (!company) return undefined
    return {
      "billing_address.first_name": company.name || "",
      "billing_address.last_name": "",
      "billing_address.company": company.name || "",
      "billing_address.address_1": company.address || "",
      "billing_address.postal_code": company.zip || "",
      "billing_address.city": company.city || "",
      "billing_address.country_code": company.country?.toLowerCase() || "",
      "billing_address.province": company.state || "",
      "billing_address.phone": company.phone || "",
    }
  }, [company])

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
      pathname + "?" + createQueryString("step", "billing-address"),
      { scroll: false }
    )
  }

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    try {
      await setBillingAddress(formData)
      router.push(pathname + "?step=details", { scroll: false })
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row items-center justify-between w-full">
          <Heading
            level="h2"
            className={clx(
              "flex flex-row text-xl gap-x-2 items-center font-medium",
              {
                "opacity-50 pointer-events-none select-none":
                  !isOpen && !cart?.billing_address?.address_1,
              }
            )}
          >
            Morada de Faturacao
            {!isOpen && cart?.billing_address?.address_1 && (
              <CheckCircleSolid />
            )}
          </Heading>

          {!isOpen && cart?.billing_address?.address_1 && (
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
          <form action={handleSubmit}>
            <div className="py-2">
              <BillingAddressForm
                cart={cart}
                initialData={companyBillingData}
                optionalFields={["first_name", "last_name"]}
              />
            </div>
            <div className="flex flex-col gap-y-2 items-end">
              <SubmitButton className="mt-6">Continuar</SubmitButton>
              <ErrorMessage error={error} />
            </div>
          </form>
        ) : (
          cart?.billing_address?.address_1 && (
            <div className="text-small-regular">
              <div className="flex items-start gap-x-8">
                <div className="flex">
                  <Text className="txt-medium text-ui-fg-subtle">
                    {cart.billing_address.first_name}{" "}
                    {cart.billing_address.last_name},{" "}
                    {cart.billing_address.address_1},{" "}
                    {cart.billing_address.postal_code},{" "}
                    {cart.billing_address.city},{" "}
                    {cart.billing_address.country_code?.toUpperCase()}
                  </Text>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </Container>
  )
}

export default QuoteBillingAddress
