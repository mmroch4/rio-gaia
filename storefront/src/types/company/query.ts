import { CustomerDTO, HttpTypes } from "@medusajs/types"
import { ModuleCompany, ModuleEmployee } from "./module"

export type QueryCompany = ModuleCompany & {
  employees: QueryEmployee[]
  cart: QueryCart[]
}

export type QueryEmployee = ModuleEmployee & {
  company: QueryCompany
  customer: CustomerDTO
}

export type QueryCart = HttpTypes.StoreCart
