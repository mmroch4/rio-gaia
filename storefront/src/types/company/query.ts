import { CustomerDTO, HttpTypes } from "@medusajs/types"
import { ModuleCompany, ModuleCompanyAddress, ModuleEmployee } from "./module"

export type QueryCompany = ModuleCompany & {
  employees: QueryEmployee[]
  addresses: QueryCompanyAddress[]
  cart: QueryCart[]
}

export type QueryEmployee = ModuleEmployee & {
  company: QueryCompany
  customer: CustomerDTO
}

export type QueryCompanyAddress = ModuleCompanyAddress & {
  company: QueryCompany
}

export type QueryCart = HttpTypes.StoreCart
