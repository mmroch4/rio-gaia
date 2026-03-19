import { HttpTypes } from "@medusajs/framework/types";
import { CustomerDTO } from "@medusajs/types";
import { ModuleCompany, ModuleEmployee } from "./module";

export type QueryCompany = ModuleCompany & {
  employees: QueryEmployee[];
  carts: HttpTypes.StoreCart[];
};

export type QueryEmployee = ModuleEmployee & {
  company: QueryCompany;
  customer: CustomerDTO;
};
