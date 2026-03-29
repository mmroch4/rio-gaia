import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Middleware that verifies the authenticated customer belongs to the company
 * referenced by `req.params.id`. Prevents cross-company access.
 *
 * Resolves the customer → employee (Remote Link) → company_id chain
 * and compares with the requested company ID.
 */
export const ensureCompanyMembership = () => {
  return async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const customerId = req.auth_context.actor_id;
    const companyId = req.params.id;

    if (!customerId || !companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const {
      data: [customer],
    } = await query.graph({
      entity: "customer",
      fields: ["employee.*"],
      filters: { id: customerId },
    });

    if (!customer?.employee || customer.employee.company_id !== companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
};
