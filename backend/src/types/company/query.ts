import { HttpTypes } from "@medusajs/framework/types";
import { CustomerDTO } from "@medusajs/types";
import { ModuleCompany, ModuleCompanyAddress, ModuleEmployee } from "./module";

export type QueryCompany = ModuleCompany & {
  employees: QueryEmployee[];
  addresses: QueryCompanyAddress[];
  carts: HttpTypes.StoreCart[];
};

export type QueryEmployee = ModuleEmployee & {
  company: QueryCompany;
  customer: CustomerDTO;
};

export type QueryCompanyAddress = ModuleCompanyAddress & {
  company: QueryCompany;
};
