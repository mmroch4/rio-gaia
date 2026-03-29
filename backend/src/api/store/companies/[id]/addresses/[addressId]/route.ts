import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { COMPANY_MODULE } from "../../../../../../modules/company";
import { ICompanyModuleService } from "../../../../../../types/company";
import {
  StoreGetCompanyAddressParamsType,
  StoreUpdateCompanyAddressType,
} from "../../../validators";

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCompanyAddressParamsType>,
  res: MedusaResponse
) => {
  const { addressId } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [company_address],
  } = await query.graph(
    {
      entity: "company_address",
      fields: req.queryConfig.fields,
      filters: {
        ...req.filterableFields,
        id: addressId,
      },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ company_address });
};

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreUpdateCompanyAddressType>,
  res: MedusaResponse
) => {
  const { id, addressId } = req.params;
  const companyModuleService: ICompanyModuleService =
    req.scope.resolve(COMPANY_MODULE);

  await companyModuleService.updateCompanyAddresses({
    id: addressId,
    company_id: id,
    ...req.validatedBody,
  });

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [company_address],
  } = await query.graph(
    {
      entity: "company_address",
      fields: req.queryConfig.fields,
      filters: {
        ...req.filterableFields,
        id: addressId,
      },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ company_address });
};

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { addressId } = req.params;
  const companyModuleService: ICompanyModuleService =
    req.scope.resolve(COMPANY_MODULE);

  await companyModuleService.deleteCompanyAddresses([addressId]);

  res.json({
    id: addressId,
    object: "company_address",
    deleted: true,
  });
};
