"use client"

import { currencySymbolMap } from "@/lib/constants"
import { updateCompany } from "@/lib/data/companies"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import Select from "@/modules/common/components/native-select"
import {
  ModuleCompanySpendingLimitResetFrequency,
  StoreCompanyResponse,
  StoreUpdateCompany,
} from "@/types"
import { AdminRegionCountry, HttpTypes } from "@medusajs/types"
import { clx, toast } from "@medusajs/ui"
import { useState } from "react"

const CompanyCard = ({
  company,
  regions,
}: StoreCompanyResponse & { regions: HttpTypes.StoreRegion[] }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { updated_at, created_at, employees, ...companyUpdateData } = company

  const [companyData, setCompanyData] = useState(
    companyUpdateData as StoreUpdateCompany
  )

  const handleGuardar = async () => {
    setIsSaving(true)
    await updateCompany(companyData).catch(() => {
      toast.error("Error updating company")
    })
    setIsSaving(false)
    setIsEditing(false)

    toast.success("Empresa atualizada")
  }

  const currenciesInRegions = Array.from(
    new Set(regions.map((region) => region.currency_code))
  )

  const countriesInRegions = Array.from(
    new Set(
      regions.flatMap((region) => region.countries).map((country) => country)
    )
  ) as AdminRegionCountry[]

  return (
    <div className="h-fit">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form
          className={clx(
            "grid grid-cols-2 gap-4 border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ",
            {
              "max-h-[480px] opacity-100 p-4": isEditing,
              "max-h-0 opacity-0": !isEditing,
            } 
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleGuardar()
            }
          }}
        >
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Nome da Empresa</label>
            <Input
              label="Nome da Empresa"
              name="name"
              value={companyData.name || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Email</label>
            <Input
              label="Email"
              name="email"
              value={companyData.email || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Telefone</label>
            <Input
              label="Telefone"
              name="phone"
              value={companyData.phone || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, phone: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Morada</label>
            <Input
              label="Morada"
              name="address"
              value={companyData.address || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, address: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Cidade</label>
            <Input
              label="Cidade"
              name="city"
              value={companyData.city || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, city: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Distrito</label>
            <Input
              label="Distrito"
              name="state"
              value={companyData.state || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, state: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Código Postal</label>
            <Input
              label="Código Postal"
              name="zip"
              value={companyData.zip || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, zip: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">País</label>
            <Select
              name="country"
              value={companyData.country || ""}
              onChange={(e) =>
                setCompanyData({ ...companyData, country: e.target.value })
              }
            >
              {countriesInRegions.map((country, index) => (
                <option key={index} value={country.id}>
                  {country.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">NIF</label>
            <Input
              label="NIF"
              name="vat"
              value={companyData.vat}
              onChange={(e) =>
                setCompanyData({ ...companyData, vat: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Moeda</label>
            <Select
              name="currency_code"
              value={companyData.currency_code || ""}
              onChange={(e) =>
                setCompanyData({
                  ...companyData,
                  currency_code: e.target.value as string,
                })
              }
            >
              {currenciesInRegions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency.toUpperCase()} ({currencySymbolMap[currency]})
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">
              Spending Limit Reset Frequency
            </label>
            <Select
              name="spending_limit_reset_frequency"
              value={companyData.spending_limit_reset_frequency}
              onChange={(e) =>
                setCompanyData({
                  ...companyData,
                  spending_limit_reset_frequency: e.target
                    .value as ModuleCompanySpendingLimitResetFrequency,
                })
              }
            >
              {Object.values(ModuleCompanySpendingLimitResetFrequency).map(
                (value) => (
                  <option key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                )
              )}
            </Select>
          </div>
        </form>
        <div
          className={clx(
            "grid grid-cols-2 gap-4 border-b border-gray-200 transition-all duration-300 ease-in-out",
            {
              "opacity-0 max-h-0": isEditing,
              "opacity-100 max-h-[320px] p-4": !isEditing,
            }
          )}
        >
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Company Name</label>
            <p className="text-gray-600">{company.name}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Email</label>
            <p className="text-gray-600">{company.email}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Telefone</label>
            <p className="text-gray-600">{company.phone}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Morada</label>
            <p className="text-gray-600">
              {company.address}, {company.city}, {company.state}, {company.zip},{" "}
              {company.country?.toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">Moeda</label>
            <p className="text-gray-600">
              {company.currency_code?.toUpperCase()} (
              {currencySymbolMap[company.currency_code!]})
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">NIF</label>
            <p className="text-gray-600">{company.vat}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="font-semibold text-gray-900 text-sm">
              Spending Limit Reset Frequency
            </label>
            <p className="text-gray-600">
              {company.spending_limit_reset_frequency?.charAt(0).toUpperCase() +
                company.spending_limit_reset_frequency?.slice(1)}
            </p>
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
                onClick={handleGuardar}
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

export default CompanyCard
