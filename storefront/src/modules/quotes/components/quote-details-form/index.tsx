"use client"

import { createQuote } from "@/lib/data/quotes"
import Button from "@/modules/common/components/button"
import { B2BCart } from "@/types"
import { CheckCircleSolid } from "@medusajs/icons"
import { clx, Container, Heading, Text, toast } from "@medusajs/ui"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import Divider from "@/modules/common/components/divider"

const QuoteDetailsForm = ({ cart }: { cart: B2BCart | null }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { countryCode } = useParams()
  const [customDetails, setCustomDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = searchParams.get("step") === "details"
  const hasAddresses =
    !!cart?.shipping_address?.address_1 && !!cart?.billing_address?.address_1

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "details"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const result = await createQuote(
        customDetails.trim() || undefined
      )

      if (result.success) {
        router.push(
          `/${countryCode}/portal/conta/orcamentos/detalhes/${result.quote.id}`
        )
      } else if (result.rateLimited) {
        toast.error("Limite atingido", { description: result.message })
      } else {
        toast.error("Falha ao criar pedido de orcamento")
      }
    } catch {
      toast.error("Falha ao criar pedido de orcamento")
    }

    setIsSubmitting(false)
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row items-center justify-between w-full">
          <Heading
            level="h2"
            className={clx(
              "flex flex-row text-xl gap-x-2 items-center font-medium",
              {
                "opacity-50 pointer-events-none select-none":
                  !isOpen && !hasAddresses,
              }
            )}
          >
            Detalhes e Notas
            {!isOpen && hasAddresses && customDetails.trim() && (
              <CheckCircleSolid />
            )}
          </Heading>

          {!isOpen && hasAddresses && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Editar
              </button>
            </Text>
          )}
        </div>
        <Divider />
        {isOpen ? (
          <div className="flex flex-col gap-y-4 py-4">
            <div>
              <label
                htmlFor="custom_details"
                className="text-sm font-medium text-ui-fg-base mb-2 block"
              >
                Notas ou instrucoes especiais
              </label>
              <textarea
                id="custom_details"
                name="custom_details"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                maxLength={2000}
                rows={4}
                className="w-full rounded-lg border border-ui-border-base bg-ui-bg-field px-4 py-3 text-sm text-ui-fg-base placeholder:text-ui-fg-muted focus:border-ui-border-interactive focus:outline-none focus:ring-0"
                placeholder="Ex: Entrega preferencial pela manha, contactar antes de enviar..."
              />
              <div className="flex justify-between mt-1">
                <Text className="text-xs text-ui-fg-muted">
                  Estas notas serao visiveis para a equipa Rio Gaia no
                  orcamento.
                </Text>
                <Text className="text-xs text-ui-fg-muted">
                  {customDetails.length}/2000
                </Text>
              </div>
            </div>

            <div className="flex flex-col gap-y-2 items-end mt-4">
              <Button
                className="w-full h-10 rounded-full"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submeter Pedido de Orcamento
              </Button>
            </div>
          </div>
        ) : (
          hasAddresses &&
          customDetails.trim() && (
            <div className="text-small-regular py-2">
              <Text className="txt-medium text-ui-fg-subtle line-clamp-2">
                {customDetails}
              </Text>
            </div>
          )
        )}
      </div>
    </Container>
  )
}

export default QuoteDetailsForm
