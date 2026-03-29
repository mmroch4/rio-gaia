import { FetchError } from "@medusajs/js-sdk";
import {
  AdminCompanyAddressResponse,
  AdminCompanyAddressesResponse,
  StoreCreateCompanyAddress,
  StoreUpdateCompanyAddress,
} from "../../../types";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { sdk } from "../../lib/client";
import { queryKeysFactory } from "../../lib/query-key-factory";
import { companyQueryKey } from "./companies";

export const companyAddressQueryKey = queryKeysFactory("company_address");

export const useCompanyAddresses = (
  companyId: string,
  query?: Record<string, any>,
  options?: UseQueryOptions<
    AdminCompanyAddressesResponse,
    FetchError,
    AdminCompanyAddressesResponse,
    QueryKey
  >
) => {
  const filterQuery = new URLSearchParams(query).toString();

  const fetchAddresses = async () =>
    sdk.client.fetch<AdminCompanyAddressesResponse>(
      `/admin/companies/${companyId}/addresses${
        filterQuery ? `?${filterQuery}` : ""
      }`,
      {
        method: "GET",
      }
    );

  return useQuery({
    queryKey: companyAddressQueryKey.list(companyId),
    queryFn: fetchAddresses,
    ...options,
  });
};

export const useCreateCompanyAddress = (
  companyId: string,
  options?: UseMutationOptions<
    AdminCompanyAddressResponse,
    FetchError,
    Omit<StoreCreateCompanyAddress, "company_id">
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: Omit<StoreCreateCompanyAddress, "company_id">) =>
      sdk.client.fetch<AdminCompanyAddressResponse>(
        `/admin/companies/${companyId}/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: address,
        }
      ),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: companyAddressQueryKey.list(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: companyQueryKey.detail(companyId),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateCompanyAddress = (
  companyId: string,
  addressId: string,
  options?: UseMutationOptions<
    AdminCompanyAddressResponse,
    FetchError,
    Partial<StoreUpdateCompanyAddress>
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: Partial<StoreUpdateCompanyAddress>) =>
      sdk.client.fetch<AdminCompanyAddressResponse>(
        `/admin/companies/${companyId}/addresses/${addressId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: address,
        }
      ),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: companyAddressQueryKey.list(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: companyQueryKey.detail(companyId),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteCompanyAddress = (
  companyId: string,
  options?: UseMutationOptions<void, FetchError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      sdk.client.fetch<void>(
        `/admin/companies/${companyId}/addresses/${addressId}`,
        {
          method: "DELETE",
        }
      ),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: companyAddressQueryKey.list(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: companyQueryKey.detail(companyId),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
