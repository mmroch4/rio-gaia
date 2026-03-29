import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { authenticate } from "@medusajs/medusa";
import { ensureCompanyMembership } from "../../middlewares/ensure-company-membership";
import { ensureRole } from "../../middlewares/ensure-role";
import {
  storeCompanyAddressQueryConfig,
  storeCompanyQueryConfig,
  storeEmployeeQueryConfig,
} from "./query-config";
import {
  StoreCreateCompany,
  StoreCreateCompanyAddress,
  StoreCreateEmployee,
  StoreGetCompanyAddressParams,
  StoreGetCompanyParams,
  StoreGetEmployeeParams,
  StoreUpdateCompanyAddress,
  StoreUpdateEmployee,
} from "./validators";

export const storeCompaniesMiddlewares: MiddlewareRoute[] = [
  /* Company middlewares */
  {
    method: "ALL",
    matcher: "/store/companies*",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/store/companies",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.list
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies",
    middlewares: [
      validateAndTransformBody(StoreCreateCompany),
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/companies/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id",
    middlewares: [
      ensureRole("company_admin"),
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/store/companies/:id",
    middlewares: [ensureRole("company_admin")],
  },

  /* Employee middlewares */
  {
    method: ["GET"],
    matcher: "/store/companies/:id/employees",
    middlewares: [
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.list
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id/employees",
    middlewares: [
      ensureRole("company_admin"),
      validateAndTransformBody(StoreCreateEmployee),
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.list
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/companies/:id/employees/:employee_id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id/employees/:employee_id",
    middlewares: [
      ensureRole("company_admin"),
      validateAndTransformBody(StoreUpdateEmployee),
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.retrieve
      ),
    ],
  },

  /* CompanyAddress middlewares */
  {
    method: "ALL",
    matcher: "/store/companies/:id/addresses*",
    middlewares: [ensureCompanyMembership()],
  },
  {
    method: ["GET"],
    matcher: "/store/companies/:id/addresses",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCompanyAddressParams,
        storeCompanyAddressQueryConfig.list
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id/addresses",
    middlewares: [
      ensureRole("company_admin"),
      validateAndTransformBody(StoreCreateCompanyAddress),
      validateAndTransformQuery(
        StoreGetCompanyAddressParams,
        storeCompanyAddressQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/companies/:id/addresses/:addressId",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCompanyAddressParams,
        storeCompanyAddressQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id/addresses/:addressId",
    middlewares: [
      ensureRole("company_admin"),
      validateAndTransformBody(StoreUpdateCompanyAddress),
      validateAndTransformQuery(
        StoreGetCompanyAddressParams,
        storeCompanyAddressQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/store/companies/:id/addresses/:addressId",
    middlewares: [ensureRole("company_admin")],
  },
];
