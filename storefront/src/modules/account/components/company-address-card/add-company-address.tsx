"use client"

import { createCompanyAddress } from "@/lib/data/companies"
import useToggleState from "@/lib/hooks/use-toggle-state"
import CountrySelect from "@/modules/checkout/components/country-select"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import Modal from "@/modules/common/components/modal"
import { Plus } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useActionState, useEffect, useState } from "react"

const AddCompanyAddress = ({
  region,
  companyId,
}: {
  region: HttpTypes.StoreRegion
  companyId: string
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(createCompanyAddress, {
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <button
        className="border border-ui-border-base rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between"
        onClick={open}
        data-testid="add-company-address-button"
      >
        <span className="text-base-semi">Nova morada de envio</span>
        <Plus />
      </button>

      <Modal isOpen={state} close={close} data-testid="add-company-address-modal">
        <Modal.Title>
          <Heading className="mb-2">Adicionar morada de envio</Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="company_id" value={companyId} />
          <Modal.Body>
            <div className="flex flex-col gap-y-2">
              <Input
                label="Etiqueta"
                name="label"
                required
                placeholder="Ex: Armazem Lisboa, Sede Porto"
                data-testid="label-input"
              />
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="Nome (opcional)"
                  name="first_name"
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Apelido (opcional)"
                  name="last_name"
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Morada"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Complemento"
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="Codigo Postal"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="Cidade"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Distrito"
                name="province"
                required
                autoComplete="address-level1"
                data-testid="province-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Telefone"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-small-regular py-2"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10"
                data-testid="cancel-button"
              >
                Cancelar
              </Button>
              <SubmitButton data-testid="save-button">Guardar</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddCompanyAddress
