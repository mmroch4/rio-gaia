import { useRemoteQueryStep } from "@medusajs/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { removeEmployeeCustomerAccountsStep } from "../../company/steps";
import { deleteEmployeesStep } from "../steps";

type DeleteEmployeesInput =
  | string
  | string[]
  | { id: string; company_id?: string };

/*
  Deletes employee(s) and cascades to their linked Medusa customer accounts:
  1. Queries employee(s) with linked customer data
  2. Soft-deletes linked customer accounts + deletes auth identities
  3. Soft-deletes employee records
*/
export const deleteEmployeesWorkflow = createWorkflow(
  "delete-employees",
  (input: WorkflowData<DeleteEmployeesInput>): WorkflowResponse<string> => {
    const ids = transform({ input }, ({ input }) => {
      if (Array.isArray(input)) return input;
      if (typeof input === "string") return [input];
      return [input.id];
    });

    const employees = useRemoteQueryStep({
      entry_point: "employee",
      fields: ["id", "customer.*"],
      variables: { id: ids },
    });

    const customerIds = transform({ employees }, ({ employees }) =>
      employees
        .filter((e: any) => e.customer?.id)
        .map((e: any) => e.customer.id)
    );

    removeEmployeeCustomerAccountsStep(customerIds);

    deleteEmployeesStep(ids);

    return new WorkflowResponse("Employee and linked customer deleted");
  }
);
