import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { COMPANY_MODULE } from "../../../../../modules/company";
import { ICompanyModuleService } from "../../../../../types/company";
import {
  AdminCreateCompanyAddressType,
  AdminGetCompanyAddressParamsType,
} from "../../validators";

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetCompanyAddressParamsType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [{ addresses }],
    metadata,
  } = await query.graph(
    {
      entity: "company",
      fields: [...req.queryConfig.fields, "addresses.*"],
      filters: {
        id,
        ...req.filterableFields,
      },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({
    company_addresses: addresses,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  });
};

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateCompanyAddressType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const companyModuleService: ICompanyModuleService =
    req.scope.resolve(COMPANY_MODULE);

  const company = await companyModuleService.retrieveCompany(id);

  const address = await companyModuleService.createCompanyAddresses({
    ...req.validatedBody,
    company_name: company.name,
    company_id: id,
  });

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [company_address],
  } = await query.graph(
    {
      entity: "company_address",
      fields: req.queryConfig.fields,
      filters: {
        id: address.id,
      },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ company_address });
};
