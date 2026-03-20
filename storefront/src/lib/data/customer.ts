"use server"

import { sdk } from "@/lib/config"
import medusaError from "@/lib/util/medusa-error"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"
import { track } from "@vercel/analytics/server"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { getOrSetCart, retrieveCart, updateCart } from "./cart"
import { createCompany, createEmployee } from "./companies"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

export const retrieveCustomer = async (): Promise<B2BCustomer | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions("customers")),
  }

  return await sdk.client
    .fetch<{ customer: B2BCustomer }>(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*employee, *orders",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ customer }) => customer as B2BCustomer)
    .catch(() => null)
}

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
    company_name: formData.get("company_name") as string,
  }
  const countryCode = formData.get("country_code") as string

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    const customHeaders = { authorization: `Bearer ${token}` }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      customHeaders
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    const customAuthHeaders = { authorization: `Bearer ${loginToken}` }

    const companyForm = {
      name: formData.get("company_name") as string,
      email: formData.get("company_email") as string,
      phone: formData.get("company_phone") as string,
      address: formData.get("company_address") as string,
      city: formData.get("company_city") as string,
      state: formData.get("company_state") as string,
      zip: formData.get("company_zip") as string,
      country: formData.get("company_country") as string,
      currency_code: formData.get("currency_code") as string,
      vat: formData.get("company_vat") as string,
      verified: false,
    }

    const createdCompany = await createCompany(companyForm, customAuthHeaders)

    const createdEmployee = await createEmployee({
      company_id: createdCompany?.id as string,
      customer_id: createdCustomer.id,
      is_admin: true,
      spending_limit: 0,
    }, customAuthHeaders).catch(() => {})
  } catch (error: any) {
    return error.toString()
  }

  redirect(`/${countryCode}/conta/verificacao-pendente`)
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const countryCode = formData.get("country_code") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        track("customer_logged_in")
        setAuthToken(token as string)

        const [customerCacheTag, productsCacheTag, cartsCacheTag] =
          await Promise.all([
            getCacheTag("customers"),
            getCacheTag("products"),
            getCacheTag("carts"),
          ])

        revalidateTag(customerCacheTag)

        const customer = await retrieveCustomer()
        const cart = await retrieveCart()

        if (!cart) {
          await getOrSetCart(countryCode)
        }
        else if (cart && customer?.employee?.company_id) {
          await updateCart({
            metadata: {
              ...cart?.metadata,
              company_id: customer.employee.company_id,
            },
          })
        }

        revalidateTag(productsCacheTag)
        revalidateTag(cartsCacheTag)

      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }

  redirect(`/${countryCode}/portal/conta`)
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()
  removeAuthToken()
  track("customer_logged_out")

  // remove next line if want the cart to persist after logout
  await removeCartId()

  const [authCacheTag, customerCacheTag, productsCacheTag, cartsCacheTag] =
    await Promise.all([
      getCacheTag("auth"),
      getCacheTag("customers"),
      getCacheTag("products"),
      getCacheTag("carts"),
    ])

  revalidateTag(authCacheTag)
  revalidateTag(customerCacheTag)
  revalidateTag(productsCacheTag)
  revalidateTag(cartsCacheTag)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")

  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  _currentState: unknown,
  formData: FormData
): Promise<any> => {
  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async () => {
      const cacheTag = await getCacheTag("customers")
      revalidateTag(cacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const cacheTag = await getCacheTag("customers")
      revalidateTag(cacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId = currentState.addressId as string

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const cacheTag = await getCacheTag("customers")
      revalidateTag(cacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export async function requestPasswordReset(
  _currentState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string

  if (!email) {
    return "Email é obrigatório."
  }

  try {
    await sdk.client.fetch("/vendor/auth/customer/emailpass/reset-password", {
      method: "POST",
      body: {
        identifier: email,
      },
    })

    return { success: true }
  } catch (error: any) {
    return "Não foi possível enviar o email de redefinição. Por favor, tente novamente."
  }
}

export async function resetPassword(
  _currentState: unknown,
  formData: FormData
) {
  const token = formData.get("token") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm_password") as string
  const countryCode = formData.get("country_code") as string

  // Validation
  if (!token || !email || !password) {
    return "Todos os campos são obrigatórios."
  }

  if (password !== confirmPassword) {
    return "As palavras-passe não coincidem."
  }

  // Password strength validation
  if (password.length < 8) {
    return "A palavra-passe deve ter pelo menos 8 caracteres."
  }

  if (!/[a-z]/.test(password)) {
    return "A palavra-passe deve conter pelo menos uma letra minúscula."
  }

  if (!/[A-Z]/.test(password)) {
    return "A palavra-passe deve conter pelo menos uma letra maiúscula."
  }

  if (!/[0-9]/.test(password)) {
    return "A palavra-passe deve conter pelo menos um número."
  }

  try {
    await sdk.client.fetch("/vendor/auth/customer/emailpass/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        email,
        password,
      },
    })

    await signout(countryCode)

    return { success: true }
  } catch (error: any) {
    // Check for specific error messages
    if (error.message?.includes("token") || error.message?.includes("expired")) {
      return "Este link de redefinição expirou. Por favor, solicite um novo."
    }

    return "Não foi possível redefinir a palavra-passe. Por favor, tente novamente."
  }
}

export async function updateCustomerPassword(
  currentState: Record<string, unknown>,
  formData: FormData
) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm_password") as string
  const email = formData.get("email") as string

  // Validation
  if (!password || !confirmPassword) {
    return { success: false, error: "Todos os campos são obrigatórios." }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "As palavras-passe não coincidem." }
  }

  // Password strength validation
  if (password.length < 8) {
    return { success: false, error: "A palavra-passe deve ter pelo menos 8 caracteres." }
  }

  if (!/[a-z]/.test(password)) {
    return { success: false, error: "A palavra-passe deve conter pelo menos uma letra minúscula." }
  }

  if (!/[A-Z]/.test(password)) {
    return { success: false, error: "A palavra-passe deve conter pelo menos uma letra maiúscula." }
  }

  if (!/[0-9]/.test(password)) {
    return { success: false, error: "A palavra-passe deve conter pelo menos um número." }
  }

  try {
    const headers = await getAuthHeaders()

    if (!headers) {
      return { success: false, error: "Não autenticado." }
    }

    await sdk.client.fetch("/vendor/auth/customer/emailpass/update", {
      method: "POST",
      headers: {
        ...headers,
      },
      body: {
        email,
        password,
      },
    })

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: "Não foi possível atualizar a palavra-passe. Por favor, tente novamente." }
  }
}
