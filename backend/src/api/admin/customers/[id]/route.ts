import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import {
  IAuthModuleService,
  ICustomerModuleService,
  RemoteQueryFunction,
} from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { deleteCustomersWorkflow } from "@medusajs/core-flows";
import { COMPANY_MODULE } from "../../../../modules/company";
import { ICompanyModuleService } from "../../../../types";

/*
  Custom DELETE handler that replaces Medusa's built-in removeCustomerAccountWorkflow.

  All lookups happen BEFORE deletion (while links are still resolvable):
  1. Finds the linked employee
  2. Finds the auth identity
  3. Soft-deletes the employee
  4. Runs deleteCustomersWorkflow (soft-deletes customer)
  5. Hard-deletes the auth identity (enables email reuse)

  GET and POST are NOT exported — Medusa's built-in handlers are used for those.
*/
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id;
  const customerService = req.scope.resolve<ICustomerModuleService>(
    Modules.CUSTOMER
  );
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH);
  const companyModuleService = req.scope.resolve<ICompanyModuleService>(
    COMPANY_MODULE
  );
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  );

  // Verify customer exists and check if they have an account
  const customer = await customerService.retrieveCustomer(id, {
    select: ["id", "has_account"],
  });

  // Find linked employee BEFORE deletion (while customer link is resolvable)
  const employeeIds: string[] = [];
  try {
    const { data: allEmployees } = await query.graph({
      entity: "employee",
      fields: ["id", "customer.id"],
    });

    for (const emp of allEmployees) {
      if (emp?.customer?.id === id) {
        employeeIds.push(emp.id);
      }
    }
  } catch {
    // No employees found — continue
  }

  // Find auth identity BEFORE deletion (while customer_id is still associated)
  let authIdentityId: string | null = null;
  if (customer.has_account) {
    try {
      const [authIdentity] = await authService.listAuthIdentities({
        app_metadata: { customer_id: id },
      });

      if (authIdentity) {
        authIdentityId = authIdentity.id;
      }
    } catch {
      // Auth identity not found — continue
    }
  }

  // Soft-delete linked employee(s)
  if (employeeIds.length) {
    await companyModuleService.softDeleteEmployees(employeeIds);
  }

  // Soft-delete customer (hook is a no-op since employee is already deleted)
  await deleteCustomersWorkflow(req.scope).run({
    input: { ids: [id] },
  });

  // Hard-delete auth identity (enables email reuse for re-registration)
  if (authIdentityId) {
    await authService.deleteAuthIdentities([authIdentityId]);
  }

  res.status(200).json({
    id,
    object: "customer",
    deleted: true,
  });
};
