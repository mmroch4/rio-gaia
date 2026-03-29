/* Company Query Config */
export const adminCompanyFields = [
  "id",
  "name",
  "logo_url",
  "email",
  "vat",
  "phone",
  "address",
  "city",
  "state",
  "zip",
  "country",
  "verified",
  "currency_code",
  "*employees",
  "*addresses",
];

export const adminCompanyQueryConfig = {
  list: {
    defaults: adminCompanyFields,
    isList: true,
  },
  retrieve: {
    defaults: adminCompanyFields,
    isList: false,
  },
};

/* Employee Query Config */
export const adminEmployeeFields = [
  "id",
  "spending_limit",
  "is_admin",
  "customer_id",
  "*customer",
  "company_id",
  "*company",
];

export const adminEmployeeQueryConfig = {
  list: {
    defaults: adminEmployeeFields,
    isList: true,
  },
  retrieve: {
    defaults: adminEmployeeFields,
    isList: false,
  },
};

/* CompanyAddress Query Config */
export const adminCompanyAddressFields = [
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

export const adminCompanyAddressQueryConfig = {
  list: {
    defaults: adminCompanyAddressFields,
    isList: true,
  },
  retrieve: {
    defaults: adminCompanyAddressFields,
    isList: false,
  },
};
