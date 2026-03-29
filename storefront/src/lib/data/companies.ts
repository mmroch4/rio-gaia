"use server"

import { sdk } from "@/lib/config"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
} from "@/lib/data/cookies"
import {
  StoreCompaniesResponse,
  StoreCompanyAddressResponse,
  StoreCompanyResponse,
  StoreCreateCompany,
  StoreCreateEmployee,
  StoreEmployeeResponse,
  StoreUpdateCompany,
  StoreUpdateEmployee,
} from "@/types"
import { track } from "@vercel/analytics/server"
import { revalidateTag } from "next/cache"

export const retrieveCompany = async (companyId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("companies")),
  }

  const { company } = await sdk.client.fetch<StoreCompanyResponse>(
    `/store/companies/${companyId}`,
    {
      query: {
        fields:
          "+spending_limit_reset_frequency,*employees.customer,*addresses",
      },
      method: "GET",
      headers,
      next,
    }
  )

  return company
}

export const createCompany = async (data: StoreCreateCompany, customHeaders?: any) => {
  const headers = {
    ...(await getAuthHeaders()),
    ...customHeaders
  }

  const {
    companies: [company],
  } = await sdk.client.fetch<StoreCompaniesResponse>(`/store/companies`, {
    method: "POST",
    body: data,
    headers,
  })

  track("company_created", {
    company_id: company.id,
    company_name: company.name,
    company_vat: company.vat
  })

  const cacheTag = await getCacheTag("companies")
  revalidateTag(cacheTag)

  return company
}

export const updateCompany = async (data: StoreUpdateCompany) => {
  const { id, ...companyData } = data

  const headers = {
    ...(await getAuthHeaders()),
  }

  const company = await sdk.client.fetch<StoreCompanyResponse>(
    `/store/companies/${id}`,
    {
      method: "POST",
      body: companyData,
      headers,
    }
  )

  const cacheTag = await getCacheTag("companies")
  revalidateTag(cacheTag)

  return company
}

export const createEmployee = async (data: StoreCreateEmployee, customHeaders?: any) => {
  const { company_id, ...employeeData } = data

  const headers = {
    ...(await getAuthHeaders()),
    ...customHeaders
  }

  const employee = await sdk.client.fetch<StoreEmployeeResponse>(
    `/store/companies/${company_id}/employees`,
    {
      method: "POST",
      body: employeeData,
      headers,
    }
  )

  track("employee_created", {
    employee_id: employee.employee.id,
  })

  const cacheTag = await getCacheTag("companies")
  revalidateTag(cacheTag)

  return employee
}

export const updateEmployee = async (data: StoreUpdateEmployee) => {
  const { id, company_id, ...employeeData } = data

  const headers = {
    ...(await getAuthHeaders()),
  }

  const employee = await sdk.client.fetch<StoreEmployeeResponse>(
    `/store/companies/${company_id}/employees/${id}`,
    {
      method: "POST",
      body: employeeData,
      headers,
    }
  )

  const cacheTag = await getCacheTag("companies")
  revalidateTag(cacheTag)

  return employee
}

export const deleteEmployee = async (companyId: string, employeeId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client.fetch(
    `/store/companies/${companyId}/employees/${employeeId}`,
    {
      method: "DELETE",
      headers,
    }
  )

  const cacheTag = await getCacheTag("companies")
  revalidateTag(cacheTag)
}

/* CompanyAddress Actions */

export const createCompanyAddress = async (
  _currentState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> => {
  const companyId = formData.get("company_id") as string

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.client.fetch<StoreCompanyAddressResponse>(
      `/store/companies/${companyId}/addresses`,
      {
        method: "POST",
        body: {
          label: formData.get("label") as string,
          first_name: (formData.get("first_name") as string) || null,
          last_name: (formData.get("last_name") as string) || null,
          address_1: formData.get("address_1") as string,
          address_2: (formData.get("address_2") as string) || null,
          postal_code: formData.get("postal_code") as string,
          city: formData.get("city") as string,
          province: formData.get("province") as string,
          country_code: formData.get("country_code") as string,
          phone: (formData.get("phone") as string) || null,
        },
        headers,
      }
    )

    const cacheTag = await getCacheTag("companies")
    revalidateTag(cacheTag)

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar morada" }
  }
}

export const updateCompanyAddress = async (
  currentState: {
    success: boolean
    error: string | null
    addressId: string
    companyId: string
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  addressId: string
  companyId: string
}> => {
  const { addressId, companyId } = currentState

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.client.fetch<StoreCompanyAddressResponse>(
      `/store/companies/${companyId}/addresses/${addressId}`,
      {
        method: "POST",
        body: {
          label: formData.get("label") as string,
          first_name: (formData.get("first_name") as string) || null,
          last_name: (formData.get("last_name") as string) || null,
          address_1: formData.get("address_1") as string,
          address_2: (formData.get("address_2") as string) || null,
          postal_code: formData.get("postal_code") as string,
          city: formData.get("city") as string,
          province: formData.get("province") as string,
          country_code: formData.get("country_code") as string,
          phone: (formData.get("phone") as string) || null,
        },
        headers,
      }
    )

    const cacheTag = await getCacheTag("companies")
    revalidateTag(cacheTag)

    return { success: true, error: null, addressId, companyId }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao atualizar morada",
      addressId,
      companyId,
    }
  }
}

export const deleteCompanyAddress = async (
  companyId: string,
  addressId: string
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client.fetch(
    `/store/companies/${companyId}/addresses/${addressId}`,
    {
      method: "DELETE",
      headers,
    }
  )

  const cacheTag = await getCacheTag("companies")
  revalidateTag(cacheTag)
}


