import { Button, Drawer, toast } from "@medusajs/ui";
import { ModuleCompanyAddress } from "../../../../../types";
import { useUpdateCompanyAddress } from "../../../../hooks/api";
import { AddressForm } from "./address-form";

export function AddressUpdateDrawer({
  companyId,
  address,
  open,
  setOpen,
}: {
  companyId: string;
  address: ModuleCompanyAddress;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const {
    mutateAsync: updateAddress,
    isPending: loading,
    error,
  } = useUpdateCompanyAddress(companyId, address.id);

  const handleSubmit = async (formData: Record<string, any>) => {
    await updateAddress(formData as any, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Shipping address updated successfully");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update address");
      },
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Shipping Address</Drawer.Title>
        </Drawer.Header>
        <AddressForm
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          initialData={address}
        />
      </Drawer.Content>
    </Drawer>
  );
}
