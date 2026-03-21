import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { deleteCustomersWorkflow } from "@medusajs/core-flows";
import { StepResponse } from "@medusajs/workflows-sdk";
import { COMPANY_MODULE } from "../../modules/company";
import { ICompanyModuleService } from "../../types";

/*
  Hook into Medusa's deleteCustomersWorkflow to cascade customer deletion
  to the linked employee record. Auth identity cleanup is handled separately
  by a subscriber on the customer.deleted event (after the workflow completes).
*/
deleteCustomersWorkflow.hooks.customersDeleted(
  async ({ ids }, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const companyModuleService =
      container.resolve<ICompanyModuleService>(COMPANY_MODULE);

    // Find employees linked to the deleted customers
    const employeeIds: string[] = [];
    const deletedCustomerIds = new Set(ids);

    try {
      const { data: allEmployees } = await query.graph({
        entity: "employee",
        fields: ["id", "customer.id"],
      });

      for (const emp of allEmployees) {
        if (emp?.customer?.id && deletedCustomerIds.has(emp.customer.id)) {
          employeeIds.push(emp.id);
        }
      }
    } catch {
      // No employees found — skip
    }

    // Soft-delete linked employees
    if (employeeIds.length) {
      await companyModuleService.softDeleteEmployees(employeeIds);
    }

    return new StepResponse(undefined, employeeIds);
  },
  async (employeeIds: string[] | undefined, { container }) => {
    if (!employeeIds?.length) {
      return;
    }

    const companyModuleService =
      container.resolve<ICompanyModuleService>(COMPANY_MODULE);

    await companyModuleService.restoreEmployees(employeeIds);
  }
);
