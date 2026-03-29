import { Button, Drawer, toast } from "@medusajs/ui";
import { useState } from "react";
import { QueryCompany } from "../../../../../types";
import { useCreateCompanyAddress } from "../../../../hooks/api";
import { AddressForm } from "./address-form";

export function AddressCreateDrawer({ company }: { company: QueryCompany }) {
  const [open, setOpen] = useState(false);

  const {
    mutateAsync: createAddress,
    isPending: loading,
    error,
  } = useCreateCompanyAddress(company.id);

  const handleSubmit = async (formData: Record<string, any>) => {
    await createAddress(formData as any, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Shipping address created successfully");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create address");
      },
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant="secondary" size="small">
          Add
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Add Shipping Address</Drawer.Title>
        </Drawer.Header>
        <AddressForm
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </Drawer.Content>
    </Drawer>
  );
}
