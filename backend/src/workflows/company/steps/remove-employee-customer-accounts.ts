import {
  IAuthModuleService,
  ICustomerModuleService,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

interface CompensationData {
  customerIds: string[];
  deletedAuthIdentityIds: string[];
}

/**
 * Soft-deletes the linked Medusa customers for a set of employee customer IDs
 * and deletes their auth identities entirely (enabling email reuse).
 */
export const removeEmployeeCustomerAccountsStep = createStep(
  "remove-employee-customer-accounts",
  async (
    customerIds: string[],
    { container }
  ): Promise<StepResponse<string[], CompensationData>> => {
    if (!customerIds.length) {
      return new StepResponse([], {
        customerIds: [],
        deletedAuthIdentityIds: [],
      });
    }

    const customerService = container.resolve<ICustomerModuleService>(
      Modules.CUSTOMER
    );
    const authService = container.resolve<IAuthModuleService>(Modules.AUTH);

    // Find which customers have accounts (need auth cleanup)
    const customers = await customerService.listCustomers(
      { id: customerIds },
      { select: ["id", "has_account"] }
    );

    const accountCustomerIds = customers
      .filter((c) => c.has_account)
      .map((c) => c.id);

    // Find auth identities linked to these customers
    const authIdentityIds: string[] = [];

    for (const customerId of accountCustomerIds) {
      try {
        const [authIdentity] = await authService.listAuthIdentities({
          app_metadata: { customer_id: customerId },
        });

        if (authIdentity) {
          authIdentityIds.push(authIdentity.id);
        }
      } catch {
        // Auth identity not found — skip
      }
    }

    // Soft-delete all customers
    await customerService.softDeleteCustomers(customerIds);

    // Delete auth identities entirely (enables email reuse for re-registration)
    if (authIdentityIds.length) {
      await authService.deleteAuthIdentities(authIdentityIds);
    }

    return new StepResponse(customerIds, {
      customerIds,
      deletedAuthIdentityIds: authIdentityIds,
    });
  },
  async (compensationData: CompensationData, { container }) => {
    if (!compensationData?.customerIds.length) {
      return;
    }

    const customerService = container.resolve<ICustomerModuleService>(
      Modules.CUSTOMER
    );

    // Restore soft-deleted customers
    await customerService.restoreCustomers(compensationData.customerIds);

    // Note: Auth identities were hard-deleted and cannot be restored automatically.
    // The user would need to re-register to create a new auth identity.
    if (compensationData.deletedAuthIdentityIds.length) {
      const logger = container.resolve("logger");
      logger.warn(
        `Compensating removeEmployeeCustomerAccountsStep: restored ${compensationData.customerIds.length} customers, but ${compensationData.deletedAuthIdentityIds.length} auth identities were hard-deleted and cannot be restored. Affected users will need to re-register.`
      );
    }
  }
);
