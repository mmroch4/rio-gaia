import { FindParams, PaginatedResponse } from "@medusajs/types";
import { ModuleCompanySpendingLimitResetFrequency } from "./module";
import { QueryCompany, QueryCompanyAddress, QueryEmployee } from "./query";
import {
  ModuleCompanyAddressFilters,
  ModuleCompanyFilters,
  ModuleEmployeeFilters,
} from "./service";

/* Filters */

export interface CompanyFilterParams extends FindParams, ModuleCompanyFilters {}

export interface EmployeeFilterParams
  extends FindParams,
    ModuleEmployeeFilters {}

export interface CompanyAddressFilterParams
  extends FindParams,
    ModuleCompanyAddressFilters {}

/* Admin */

/* Company */
export type AdminCompanyResponse = {
  company: QueryCompany;
};

export type AdminCompaniesResponse = PaginatedResponse<{
  companies: QueryCompany[];
}>;

export type AdminCreateCompany = {
  name: string;
  phone: string;
  email: string;
  vat: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  logo_url: string | null;
  currency_code: string | null;
  verified?: boolean;
};

export type AdminUpdateCompany = Partial<AdminCreateCompany>;

/* Employee */

export type AdminEmployeeResponse = {
  employee: QueryEmployee;
};

export type AdminEmployeesResponse = PaginatedResponse<{
  employees: QueryEmployee[];
}>;

export type AdminCreateEmployee = {
  spending_limit: number;
  is_admin: boolean;
  company_id: string;
  customer_id: string;
};

export type AdminUpdateEmployee = Partial<AdminCreateEmployee>;

/* Store */

/* Company */

export type StoreCompanyResponse = {
  company: QueryCompany;
};

export type StoreCompaniesResponse = PaginatedResponse<{
  companies: QueryCompany[];
}>;

export type StoreCompanyPreviewResponse = {
  company: QueryCompany;
};

export type StoreCreateCompany = {
  name: string;
  phone?: string | null;
  email: string;
  vat: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  logo_url?: string | null;
  currency_code: string;
  verified?: boolean;
};

export type StoreUpdateCompany = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vat: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  logo_url: string | null;
  currency_code: string;
  verified?: boolean;
  spending_limit_reset_frequency?: ModuleCompanySpendingLimitResetFrequency;
};

/* Employee */

export type StoreEmployeeResponse = {
  employee: QueryEmployee;
};

export type StoreEmployeesResponse = PaginatedResponse<{
  employees: QueryEmployee[];
}>;

export type StoreCreateEmployee = {
  customer_id: string;
  spending_limit: number;
  is_admin: boolean;
  company_id: string;
};

export type StoreUpdateEmployee = {
  id: string;
  spending_limit: number;
  is_admin: boolean;
  company_id: string;
};

/* CompanyAddress */

export type AdminCompanyAddressResponse = {
  company_address: QueryCompanyAddress;
};

export type AdminCompanyAddressesResponse = PaginatedResponse<{
  company_addresses: QueryCompanyAddress[];
}>;

export type StoreCompanyAddressResponse = {
  company_address: QueryCompanyAddress;
};

export type StoreCompanyAddressesResponse = PaginatedResponse<{
  company_addresses: QueryCompanyAddress[];
}>;

export type StoreCreateCompanyAddress = {
  label: string;
  first_name?: string | null;
  last_name?: string | null;
  company_name: string;
  address_1: string;
  address_2?: string | null;
  postal_code: string;
  city: string;
  province: string;
  country_code: string;
  phone?: string | null;
  company_id: string;
};

export type StoreUpdateCompanyAddress = {
  id: string;
  label?: string;
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string;
  address_1?: string;
  address_2?: string | null;
  postal_code?: string;
  city?: string;
  province?: string;
  country_code?: string;
  phone?: string | null;
  company_id: string;
};
