import { MedusaService } from "@medusajs/framework/utils";
import { Company, CompanyAddress, Employee } from "./models";

class CompanyModuleService extends MedusaService({
  Company,
  CompanyAddress,
  Employee,
}) {}

export default CompanyModuleService;
