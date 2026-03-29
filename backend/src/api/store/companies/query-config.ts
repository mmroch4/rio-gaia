/* Store Company Query Config */
export const storeCompanyFields = [
  "id",
  "name",
  "logo_url",
  "email",
  "phone",
  "verified",
  "vat",
  "address",
  "city",
  "state",
  "zip",
  "country",
  "currency_code",
  "*employees",
  "*addresses",
];

export const storeCompanyQueryConfig = {
  list: {
    defaults: storeCompanyFields,
    isList: true,
  },
  retrieve: {
    defaults: storeCompanyFields,
    isList: false,
  },
};

/* Store Employee Query Config */
export const storeEmployeeFields = [
  "id",
  "spending_limit",
  "is_admin",
  "customer_id",
  "*customer",
  "company_id",
  "*company",
];

export const storeEmployeeQueryConfig = {
  list: {
    defaults: storeEmployeeFields,
    isList: true,
  },
  retrieve: {
    defaults: storeEmployeeFields,
    isList: false,
  },
};

/* Store CompanyAddress Query Config */
export const storeCompanyAddressFields = [
  "id",
  "label",
  "first_name",
  "last_name",
  "company_name",
  "address_1",
  "address_2",
  "postal_code",
  "city",
  "province",
  "country_code",
  "phone",
  "company_id",
];

export const storeCompanyAddressQueryConfig = {
  list: {
    defaults: storeCompanyAddressFields,
    isList: true,
  },
  retrieve: {
    defaults: storeCompanyAddressFields,
    isList: false,
  },
};
