import { useRemoteQueryStep } from "@medusajs/core-flows";
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/workflows-sdk";
import { ModuleDeleteCompany } from "../../../types";
import { deleteEmployeesStep } from "../../employee/steps";
import {
  deleteCompaniesStep,
  removeCompanyEmployeesFromCustomerGroupStep,
  removeEmployeeCustomerAccountsStep,
} from "../steps";

/*
  Deletes a company and cascades through all associated entities:
  1. Queries the company's employees and their linked customers
  2. Removes employees from the company's customer group
  3. Soft-deletes linked Medusa customer accounts + clears auth identities
  4. Soft-deletes employee records
  5. Soft-deletes the company record

  All steps have compensation functions for rollback on failure.
*/
export const deleteCompaniesWorkflow = createWorkflow(
  "delete-companies",
  function (input: ModuleDeleteCompany) {
    const company = useRemoteQueryStep({
      entry_point: "company",
      fields: [
        "id",
        "employees.*",
        "employees.customer.*",
        "customer_group.*",
      ],
      variables: { id: input.id },
      list: false,
      throw_if_key_not_found: true,
    });

    // Extract employee IDs and their linked customer IDs
    const { employeeIds, customerIds } = transform(
      { company },
      ({ company }) => {
        const employees = company.employees || [];
        return {
          employeeIds: employees.map((e: any) => e.id),
          customerIds: employees
            .filter((e: any) => e.customer?.id)
            .map((e: any) => e.customer.id),
        };
      }
    );

    // Step 1: Remove employees from the company's customer group
    removeCompanyEmployeesFromCustomerGroupStep({
      company_id: input.id,
    });

    // Step 2: Soft-delete linked customer accounts + clear auth identities
    removeEmployeeCustomerAccountsStep(customerIds);

    // Step 3: Soft-delete employee records
    deleteEmployeesStep(employeeIds);

    // Step 4: Soft-delete the company
    deleteCompaniesStep([input.id]);

    return new WorkflowResponse(undefined);
  }
);
