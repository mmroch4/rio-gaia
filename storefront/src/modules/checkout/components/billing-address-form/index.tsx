import CountrySelect from "@/modules/checkout/components/country-select"
import Input from "@/modules/common/components/input"
import { B2BCart } from "@/types"
import React, { useEffect, useState } from "react"

const BillingAddressForm = ({
  cart,
  readOnlyFields = [],
  optionalFields = [],
  initialData,
}: {
  cart: B2BCart | null
  readOnlyFields?: string[]
  optionalFields?: string[]
  initialData?: Record<string, string>
}) => {
  const isReadOnly = (field: string) => readOnlyFields.includes(field)
  const isOptional = (field: string) => optionalFields.includes(field)
  
  console.log(initialData)
  
  const [formData, setFormData] = useState<Record<string, any>>({
    "billing_address.first_name": initialData?.["billing_address.first_name"] || "",
    "billing_address.last_name": initialData?.["billing_address.last_name"] || "",
    "billing_address.address_1": initialData?.["billing_address.address_1"] || "",
    "billing_address.company": initialData?.["billing_address.company"] || cart?.company?.name || "",
    "billing_address.postal_code": initialData?.["billing_address.postal_code"] || "",
    "billing_address.city": initialData?.["billing_address.city"] || "",
    "billing_address.country_code": initialData?.["billing_address.country_code"] || "",
    "billing_address.province": initialData?.["billing_address.province"] || "",
    "billing_address.phone": initialData?.["billing_address.phone"] || "",
  })

  useEffect(() => {
    if (initialData) return
    if (cart?.billing_address) {
      setFormData({
        "billing_address.first_name": cart.billing_address.first_name || "",
        "billing_address.last_name": cart.billing_address.last_name || "",
        "billing_address.address_1": cart.billing_address.address_1 || "",
        "billing_address.company": cart.billing_address.company || "",
        "billing_address.postal_code": cart.billing_address.postal_code || "",
        "billing_address.city": cart.billing_address.city || "",
        "billing_address.country_code": cart.billing_address.country_code || "",
        "billing_address.province": cart.billing_address.province || "",
        "billing_address.phone": cart.billing_address.phone || "",
      })
    }
  }, [cart?.billing_address, initialData])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={isOptional("first_name") ? "First name (optional)" : "First name"}
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required={!isOptional("first_name")}
          readOnly={isReadOnly("first_name")}
          tabIndex={isReadOnly("first_name") ? -1 : undefined}
          className={isReadOnly("first_name") ? "bg-ui-bg-disabled text-ui-fg-disabled cursor-not-allowed" : undefined}
          data-testid="billing-first-name-input"
        />
        <Input
          label={isOptional("last_name") ? "Last name (optional)" : "Last name"}
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required={!isOptional("last_name")}
          readOnly={isReadOnly("last_name")}
          tabIndex={isReadOnly("last_name") ? -1 : undefined}
          className={isReadOnly("last_name") ? "bg-ui-bg-disabled text-ui-fg-disabled cursor-not-allowed" : undefined}
          data-testid="billing-last-name-input"
        />
        <Input
          label="Phone"
          name="billing_address.phone"
          autoComplete="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
          required
          data-testid="billing-phone-input"
        />
        <Input
          label="Company name"
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          readOnly={isReadOnly("company")}
          tabIndex={isReadOnly("company") ? -1 : undefined}
          className={isReadOnly("company") ? "bg-ui-bg-disabled text-ui-fg-disabled cursor-not-allowed" : undefined}
          data-testid="billing-company-input"
          colSpan={2}
        />
        <Input
          label="Address"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
          colSpan={2}
        />
        <Input
          label="Postal code"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-code-input"
          colSpan={2}
        />
        <div className="grid small:grid-cols-3 grid-cols-2 gap-4 col-span-2">
          <Input
            label="City"
            name="billing_address.city"
            autoComplete="address-level2"
            value={formData["billing_address.city"]}
            onChange={handleChange}
            required
            data-testid="billing-city-input"
          />
          <Input
            label="Province"
            name="billing_address.province"
            autoComplete="address-level1"
            value={formData["billing_address.province"]}
            onChange={handleChange}
            required
            data-testid="billing-province-input"
          />
          <CountrySelect
            name="billing_address.country_code"
            autoComplete="country"
            region={cart?.region}
            value={formData["billing_address.country_code"]}
            onChange={handleChange}
            required
            data-testid="billing-country-select"
          />
        </div>
      </div>
    </>
  )
}

export default BillingAddressForm
