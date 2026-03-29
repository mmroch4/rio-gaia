import { Button, Drawer, Input, Label, Select, Text } from "@medusajs/ui";
import { useState } from "react";
import { ModuleCompanyAddress } from "../../../../../types";

type AddressFormData = {
  label: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  postal_code: string;
  city: string;
  province: string;
  country_code: string;
  phone: string;
};

export function AddressForm({
  handleSubmit,
  loading,
  error,
  initialData,
}: {
  handleSubmit: (data: AddressFormData) => Promise<void>;
  loading: boolean;
  error: Error | null;
  initialData?: ModuleCompanyAddress;
}) {
  const [formData, setFormData] = useState<AddressFormData>({
    label: initialData?.label || "",
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    address_1: initialData?.address_1 || "",
    address_2: initialData?.address_2 || "",
    postal_code: initialData?.postal_code || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    country_code: initialData?.country_code || "pt",
    phone: initialData?.phone || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      <Drawer.Body className="flex flex-col p-4 gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="h2-core">Shipping Address</h2>
          <div className="flex flex-col gap-2">
            <Label size="xsmall" className="txt-compact-small font-medium">
              Label
            </Label>
            <Input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="e.g. Warehouse Lisbon"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <Label size="xsmall" className="txt-compact-small font-medium">
                First Name (optional)
              </Label>
              <Input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label size="xsmall" className="txt-compact-small font-medium">
                Last Name (optional)
              </Label>
              <Input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label size="xsmall" className="txt-compact-small font-medium">
              Address
            </Label>
            <Input
              type="text"
              name="address_1"
              value={formData.address_1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label size="xsmall" className="txt-compact-small font-medium">
              Address Line 2
            </Label>
            <Input
              type="text"
              name="address_2"
              value={formData.address_2}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <Label size="xsmall" className="txt-compact-small font-medium">
                Postal Code
              </Label>
              <Input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label size="xsmall" className="txt-compact-small font-medium">
                City
              </Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <Label size="xsmall" className="txt-compact-small font-medium">
                Province
              </Label>
              <Input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label size="xsmall" className="txt-compact-small font-medium">
                Country
              </Label>
              <Select
                value={formData.country_code}
                onValueChange={(value) =>
                  setFormData({ ...formData, country_code: value })
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select country" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="pt">Portugal (PT)</Select.Item>
                  <Select.Item value="es">Spain (ES)</Select.Item>
                  <Select.Item value="fr">France (FR)</Select.Item>
                  <Select.Item value="de">Germany (DE)</Select.Item>
                  <Select.Item value="it">Italy (IT)</Select.Item>
                  <Select.Item value="nl">Netherlands (NL)</Select.Item>
                  <Select.Item value="be">Belgium (BE)</Select.Item>
                  <Select.Item value="gb">United Kingdom (GB)</Select.Item>
                  <Select.Item value="ie">Ireland (IE)</Select.Item>
                  <Select.Item value="at">Austria (AT)</Select.Item>
                  <Select.Item value="ch">Switzerland (CH)</Select.Item>
                  <Select.Item value="pl">Poland (PL)</Select.Item>
                  <Select.Item value="br">Brazil (BR)</Select.Item>
                  <Select.Item value="us">United States (US)</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label size="xsmall" className="txt-compact-small font-medium">
              Phone
            </Label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="secondary">Cancel</Button>
        </Drawer.Close>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
        {error && <Text className="text-red-500">{error.message}</Text>}
      </Drawer.Footer>
    </form>
  );
}
