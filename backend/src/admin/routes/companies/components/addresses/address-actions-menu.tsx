import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { DropdownMenu, IconButton, toast } from "@medusajs/ui";
import { useState } from "react";
import { ModuleCompanyAddress } from "../../../../../types";
import { DeletePrompt } from "../../../../components/common";
import { useDeleteCompanyAddress } from "../../../../hooks/api";
import { AddressUpdateDrawer } from "./address-update-drawer";

export const AddressActionsMenu = ({
  companyId,
  address,
}: {
  companyId: string;
  address: ModuleCompanyAddress;
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: mutateDelete, isPending: loadingDelete } =
    useDeleteCompanyAddress(companyId);

  const handleDelete = async () => {
    await mutateDelete(address.id, {
      onSuccess: () => {
        toast.success("Shipping address deleted successfully");
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton variant="transparent">
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="gap-x-2"
            onClick={() => setEditOpen(true)}
          >
            <PencilSquare />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="gap-x-2"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <AddressUpdateDrawer
        companyId={companyId}
        address={address}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <DeletePrompt
        handleDelete={handleDelete}
        loading={loadingDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};
