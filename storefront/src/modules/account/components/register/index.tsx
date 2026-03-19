"use client"

import { currencySymbolMap } from "@/lib/constants"
import { signup } from "@/lib/data/customer"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Input from "@/modules/common/components/input"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import PasswordStrengthIndicator from "@/modules/common/components/password-strength-indicator"
import { HttpTypes } from "@medusajs/types"
import { Checkbox, Label, Select, Text } from "@medusajs/ui"
import { ChangeEvent, useActionState, useEffect, useState } from "react"

type Props = {
  regions: HttpTypes.StoreRegion[]
  countryCode: string
}

interface FormData {
  email: string
  first_name: string
  last_name: string
  phone: string
  company_name: string
  company_email: string
  company_vat: string
  company_phone: string
  password: string
  company_address: string
  company_city: string
  company_state: string
  company_zip: string
  company_country: string
  currency_code: string
}

const initialFormData: FormData = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  company_name: "",
  company_email: "",
  company_vat: "",
  company_phone: "",
  password: "",
  company_address: "",
  company_city: "",
  company_state: "",
  company_zip: "",
  company_country: "",
  currency_code: "",
}

const placeholder = ({
  placeholder,
  required,
}: {
  placeholder: string
  required: boolean
}) => {
  return (
    <span className="text-ui-fg-muted">
      {placeholder}
      {required && <span className="text-ui-fg-error">*</span>}
    </span>
  )
}

const Register = ({ regions, countryCode }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  // Set default company_country based on countryCode prop
  useEffect(() => {
    const countries = regions
      .flatMap((region) =>
        region.countries?.map((country) => country?.iso_2 || country?.iso_3)
      )
      .filter((code) => code !== undefined)

    // Only set if countryCode matches an available country and company_country is not already set
    if (countries.includes(countryCode) && !formData.company_country) {
      setFormData((prev) => ({
        ...prev,
        company_country: countryCode,
      }))
    }
  }, [countryCode, regions, formData.company_country])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isValid =
    termsAccepted &&
    !!formData.email &&
    !!formData.first_name &&
    !!formData.last_name &&
    !!formData.phone &&
    !!formData.company_name &&
    !!formData.company_email &&
    !!formData.company_vat &&
    !!formData.company_phone &&
    !!formData.password &&
    !!formData.company_address &&
    !!formData.company_city &&
    !!formData.company_zip &&
    !!formData.company_country &&
    !!formData.currency_code

  const countries = regions
    .flatMap((region) =>
      region.countries?.map((country) => ({ name: country?.display_name || country?.name, code: country?.iso_2 || country?.iso_3 }))
    )
    .filter((country) => country?.code !== undefined && country?.name !== undefined)

  const currencies = regions.map((region) => region.currency_code)

  return (
    <div
      className="w-full flex flex-col gap-6"
      data-testid="register-page"
    >
      <Text className="text-4xl text-neutral-950 text-left">
        Criar Conta Empresarial
      </Text>
      <Text className="text-neutral-600 text-base-regular">
        Preencha os dados abaixo para criar a sua conta
      </Text>

      {message && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4" data-testid="register-error">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">Erro ao criar conta</h4>
              <p className="text-sm text-red-700">{message}</p>
            </div>
          </div>
        </div>
      )}

      <form className="w-full flex flex-col" action={formAction}>
        {/* Personal Information Section */}
        <div className="flex flex-col w-full gap-y-4">
          <h3 className="text-gray-900 font-semibold text-lg mt-2">
            Informação Pessoal
          </h3>
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
            className="bg-white"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Primeiro nome"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
            className="bg-white"
            value={formData.first_name}
            onChange={handleChange}
          />
          <Input
            label="Último nome"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
            className="bg-white"
            value={formData.last_name}
            onChange={handleChange}
          />
          <Input
            label="Telefone"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
            className="bg-white"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            label="Palavra-passe"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
            className="bg-white"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordStrengthIndicator
            password={formData.password}
            showCriteria={true}
          />
        </div>

        {/* Divider */}
        <div className="border-b border-neutral-200 my-6" />

        {/* Company Information Section */}
        <div className="flex flex-col w-full gap-y-4">
          <h3 className="text-gray-900 font-semibold text-lg">
            Informação da Empresa
          </h3>
          <Input
            label="Nome da empresa"
            name="company_name"
            required
            autoComplete="organization"
            data-testid="company-name-input"
            className="bg-white"
            value={formData.company_name}
            onChange={handleChange}
          />
          <Input
            label="Email da empresa"
            name="company_email"
            required
            type="email"
            autoComplete="email"
            data-testid="company-email-input"
            className="bg-white"
            value={formData.company_email}
            onChange={handleChange}
          />
          <Input
            label="NIF"
            name="company_vat"
            required
            autoComplete="off"
            data-testid="company-vat-input"
            className="bg-white"
            value={formData.company_vat}
            onChange={handleChange}
          />
          <Input
            label="Telefone da empresa"
            name="company_phone"
            required
            type="tel"
            autoComplete="tel"
            data-testid="company-phone-input"
            className="bg-white"
            value={formData.company_phone}
            onChange={handleChange}
          />
          <Input
            label="Morada da empresa"
            name="company_address"
            required
            autoComplete="address"
            data-testid="company-address-input"
            className="bg-white"
            value={formData.company_address}
            onChange={handleChange}
          />
          <Input
            label="Cidade da empresa"
            name="company_city"
            required
            autoComplete="city"
            data-testid="company-city-input"
            className="bg-white"
            value={formData.company_city}
            onChange={handleChange}
          />
          <Input
            label="Distrito da empresa"
            name="company_state"
            autoComplete="state"
            data-testid="company-state-input"
            className="bg-white"
            value={formData.company_state}
            onChange={handleChange}
          />
          <Input
            label="Código postal da empresa"
            name="company_zip"
            required
            autoComplete="postal-code"
            data-testid="company-zip-input"
            className="bg-white"
            value={formData.company_zip}
            onChange={handleChange}
          />
          <Select
            name="company_country"
            required
            autoComplete="country"
            data-testid="company-country-input"
            value={formData.company_country}
            onValueChange={handleSelectChange("company_country")}
          >
            <Select.Trigger className="rounded-full h-10 px-4">
              <Select.Value
                placeholder={placeholder({
                  placeholder: "Selecione um país",
                  required: true,
                })}
              />
            </Select.Trigger>
            <Select.Content>
              {countries?.map((country) => {
                if (!country?.code || !country?.name) {
                  return ""
                }

                return (
                  <Select.Item key={country.code} value={country.code}>
                    {country.name}
                  </Select.Item>
                )
              })}
            </Select.Content>
          </Select>
          <input type="hidden" name="country_code" value={countryCode} />
          <Select
            name="currency_code"
            required
            autoComplete="currency"
            data-testid="company-currency-input"
            value={formData.currency_code}
            onValueChange={handleSelectChange("currency_code")}
          >
            <Select.Trigger className="rounded-full h-10 px-4">
              <Select.Value
                placeholder={placeholder({
                  placeholder: "Selecione uma moeda",
                  required: true,
                })}
              />
            </Select.Trigger>
            <Select.Content>
              {[...new Set(currencies)].map((currency) => (
                <Select.Item key={currency} value={currency}>
                  {currency.toUpperCase()} ({currencySymbolMap[currency]})
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="border-b border-neutral-200 my-6" />
        <div className="flex items-center gap-2">
          <Checkbox
            name="terms"
            id="terms-checkbox"
            data-testid="terms-checkbox"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
          ></Checkbox>
          <Label
            id="terms-label"
            className="flex items-center text-ui-fg-base !text-xs hover:cursor-pointer !transform-none"
            htmlFor="terms-checkbox"
            data-testid="terms-label"
          >
            Li e aceito os{" "}
            <LocalizedClientLink
              href="/termos-e-condicoes"
              className="text-[#0047AB] hover:text-[#003685] hover:underline mx-1"
              target="_blank"
            >
              termos e condições
            </LocalizedClientLink>.
          </Label>
        </div>
        <SubmitButton
          className="w-full mt-6 !bg-[#0047AB] hover:!bg-[#003685] text-white px-6 py-3 rounded-md transition-colors shadow-md font-semibold"
          data-testid="register-button"
          disabled={!isValid}
        >
          Criar Conta
        </SubmitButton>
      </form>
      <div className="text-center text-gray-600 text-sm mt-4">
        Já tem conta?{" "}
        <LocalizedClientLink href="/conta/entrar" className="text-[#0047AB] hover:text-[#003685] hover:underline font-semibold">
          Iniciar Sessão
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Register
