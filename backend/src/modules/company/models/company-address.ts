import { model } from "@medusajs/framework/utils";
import { Company } from "./company";

export const CompanyAddress = model.define("company_address", {
  id: model
    .id({
      prefix: "caddr",
    })
    .primaryKey(),
  label: model.text(),
  first_name: model.text().nullable(),
  last_name: model.text().nullable(),
  company_name: model.text(),
  address_1: model.text(),
  address_2: model.text().nullable(),
  postal_code: model.text(),
  city: model.text(),
  province: model.text(),
  country_code: model.text(),
  phone: model.text().nullable(),
  company: model.belongsTo(() => Company, {
    mappedBy: "addresses",
  }),
});
