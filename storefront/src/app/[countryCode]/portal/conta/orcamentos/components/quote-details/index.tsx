"use client"

import { acceptQuote, rejectQuote } from "@/lib/data/quotes"
import { formatAmount } from "@/modules/common/components/amount-cell"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { PromptModal } from "@/modules/common/components/prompt-modal"
import { B2BCustomer } from "@/types/global"
import { StoreQuoteResponse } from "@/types/quote"
import { ArrowUturnLeft, CheckCircleSolid } from "@medusajs/icons"
import { AdminOrderLineItem, AdminOrderPreview } from "@medusajs/types"
import { clx, Container, Heading, Text, toast } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import React, { useMemo, useState } from "react"
import QuoteMessages from "../quote-messages"
import QuoteStatusBadge from "../quote-status-badge"
import { QuoteTableItem } from "../quote-table"

type QuoteDetailsProps = {
  quote: StoreQuoteResponse["quote"] & {
    customer: B2BCustomer
  }
  preview: AdminOrderPreview
  countryCode: string
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  quote,
  preview,
  countryCode,
}) => {
  const order = quote.draft_order
  const originalItemsMap = useMemo(() => {
    return new Map<string, AdminOrderLineItem>(
      order.items?.map((item: AdminOrderLineItem) => [item.id, item])
    )
  }, [order])
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  return (
    <div className="flex flex-col gap-y-2 p-0">
      <div className="flex gap-2 justify-between items-center mb-2">
        <LocalizedClientLink
          href="/portal/conta/orcamentos"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
          data-testid="back-to-overview-button"
        >
          <Button variant="secondary">
            <ArrowUturnLeft /> Voltar
          </Button>
        </LocalizedClientLink>
      </div>

      <div className="small:grid small:grid-cols-6 flex flex-col-reverse small:gap-4 gap-2">
        <div className="small:col-span-4 flex flex-col gap-y-2">
          {quote.status === "accepted" && (
            <Container className="p-0">
              <div className="flex items-center justify-between px-6 py-4">
                <Text className="txt-compact-small">
                  <CheckCircleSolid className="inline-block mr-2 text-green-500 text-lg" />
                  Orçamento aceite. A encomenda está pronta para processamento.
                </Text>

                <Button
                  size="small"
                  onClick={() =>
                    router.push(
                      `/${countryCode}/portal/conta/encomendas/detalhes/${quote.draft_order_id}`
                    )
                  }
                >
                  Ver Encomenda
                </Button>
              </div>
            </Container>
          )}

          {preview.items?.map((item) => (
            <Container key={item.id}>
              <QuoteTableItem
                key={item.id}
                item={item}
                originalItem={originalItemsMap.get(item.id)}
                currencyCode={order.currency_code}
              />
            </Container>
          ))}

          <Container className="p-0">
            <div className="py-4 px-6">
              <span className="txt-small text-ui-fg-base font-semibold mb-2 block">
                Resumo
              </span>

              <div className="flex flex-col gap-y-1">
                <div className="flex items-center justify-between">
                  <span className="txt-small text-ui-fg-subtle">Subtotal</span>
                  <span className="txt-small text-ui-fg-subtle">
                    {formatAmount(order.subtotal, order.currency_code)}
                  </span>
                </div>

                {order.discount_total > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="txt-small text-ui-fg-subtle">
                      Desconto
                    </span>
                    <span className="txt-small text-ui-fg-subtle">
                      - {formatAmount(order.discount_total, order.currency_code)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="txt-small text-ui-fg-subtle">Portes</span>
                  <span className="txt-small text-ui-fg-subtle">
                    {formatAmount(order.shipping_total, order.currency_code)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="txt-small text-ui-fg-subtle">Impostos</span>
                  <span className="txt-small text-ui-fg-subtle">
                    {formatAmount(order.tax_total, order.currency_code)}
                  </span>
                </div>

                <div className="h-px w-full border-b border-gray-200 border-dashed my-2" />

                <div className="flex items-center justify-between">
                  <span className="txt-small text-ui-fg-subtle font-semibold">
                    Total Original
                  </span>
                  <span className="txt-small text-ui-fg-subtle">
                    {formatAmount(order.total, order.currency_code)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="txt-small text-ui-fg-subtle font-semibold">
                    Novo Total
                  </span>
                  <div className="flex items-center gap-x-2">
                    <span className="txt-small text-ui-fg-subtle">
                      {formatAmount(preview.total, order.currency_code)}
                    </span>
                    {preview.total !== order.total && (
                      <span
                        className={clx("txt-small font-medium", {
                          "text-green-600": preview.total < order.total,
                          "text-red-600": preview.total > order.total,
                        })}
                      >
                        {preview.total < order.total ? "-" : "+"}
                        {formatAmount(
                          Math.abs(preview.total - order.total),
                          order.currency_code
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>

          {quote.status === "pending_customer" && (
            <div className="flex gap-x-3 justify-end my-4">
              <PromptModal
                title="Rejeitar Orçamento?"
                description="Tem a certeza de que deseja rejeitar o orçamento? Esta ação é irreversível."
                cancelLabel="Cancelar"
                confirmLabel="Confirmar"
                handleAction={() => {
                  setIsRejecting(true)

                  rejectQuote(quote.id)
                    .catch((e) => toast.error(e.message))
                    .finally(() => setIsRejecting(false))
                }}
                isLoading={isRejecting}
              >
                <Button size="small" variant="secondary">
                  Rejeitar Orçamento
                </Button>
              </PromptModal>

              <PromptModal
                title="Aceitar Orçamento?"
                description="Tem a certeza de que deseja aceitar o orçamento? Esta ação é irreversível."
                cancelLabel="Cancelar"
                confirmLabel="Confirmar"
                handleAction={() => {
                  setIsAccepting(true)

                  acceptQuote(quote.id)
                    .catch((e) => toast.error(e.message))
                    .finally(() => setIsAccepting(false))
                }}
                isLoading={isAccepting}
              >
                <Button size="small" variant="primary">
                  Aceitar Orçamento
                </Button>
              </PromptModal>
            </div>
          )}

          <QuoteMessages quote={quote} preview={preview} />
        </div>

        <div className="col-span-2 flex flex-col gap-y-2">
          <Container className="flex gap-x-3 justify-between">
            <div className="text-sm">
              <span className="font-semibold text-ui-fg-subtle">
                N.º Orçamento:
              </span>{" "}
              #<span>{quote.draft_order.display_id}</span>
            </div>

            <QuoteStatusBadge status={quote.status} />
          </Container>

          <Container>
            <div className="text-sm text-ui-fg-subtle">
              <div className="flex justify-between">
                <Text>Data de Criação</Text>
                <Text>
                  {new Date(quote.created_at).toLocaleDateString("pt-PT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </div>
          </Container>

          <Container>
            <Heading level="h3" className="mb-2">
              Cliente
            </Heading>

            <div className="text-sm text-ui-fg-subtle">
              <div className="flex justify-between">
                <Text>Email</Text>
                <Text>{quote.customer?.email || "-"}</Text>
              </div>

              <div className="flex justify-between">
                <Text>Telefone</Text>
                <Text>{quote.customer?.phone || "-"}</Text>
              </div>

              <div className="flex justify-between">
                <Text>Limite de Gastos</Text>
                <Text>
                  {(quote.customer?.employee?.spending_limit &&
                    formatAmount(
                      quote.customer?.employee?.spending_limit || 0,
                      order.currency_code.toUpperCase()
                    )) ||
                    "-"}
                </Text>
              </div>
            </div>
          </Container>

          <Container>
            <Heading level="h3" className="mb-2">
              Empresa
            </Heading>

            <div className="text-sm text-ui-fg-subtle">
              <div className="flex justify-between">
                <Text>Nome</Text>
                <Text>{quote.customer?.employee?.company?.name || "-"}</Text>
              </div>
            </div>
          </Container>

          {order.shipping_address && (
            <Container>
              <Heading level="h3" className="mb-2">
                Morada de Entrega
              </Heading>

              <div className="text-sm text-ui-fg-subtle">
                <Text>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </Text>
                {order.shipping_address.company && (
                  <Text>{order.shipping_address.company}</Text>
                )}
                <Text>{order.shipping_address.address_1}</Text>
                <Text>
                  {order.shipping_address.postal_code}{" "}
                  {order.shipping_address.city}
                </Text>
                {order.shipping_address.province && (
                  <Text>{order.shipping_address.province}</Text>
                )}
                <Text>
                  {order.shipping_address.country_code?.toUpperCase()}
                </Text>
                {order.shipping_address.phone && (
                  <Text>{order.shipping_address.phone}</Text>
                )}
              </div>
            </Container>
          )}

          {order.billing_address && (
            <Container>
              <Heading level="h3" className="mb-2">
                Morada de Faturação
              </Heading>

              <div className="text-sm text-ui-fg-subtle">
                <Text>
                  {order.billing_address.first_name}{" "}
                  {order.billing_address.last_name}
                </Text>
                {order.billing_address.company && (
                  <Text>{order.billing_address.company}</Text>
                )}
                <Text>{order.billing_address.address_1}</Text>
                <Text>
                  {order.billing_address.postal_code}{" "}
                  {order.billing_address.city}
                </Text>
                {order.billing_address.province && (
                  <Text>{order.billing_address.province}</Text>
                )}
                <Text>
                  {order.billing_address.country_code?.toUpperCase()}
                </Text>
                {order.billing_address.phone && (
                  <Text>{order.billing_address.phone}</Text>
                )}
              </div>
            </Container>
          )}

          {quote.custom_details && (
            <Container>
              <Heading level="h3" className="mb-2">
                Notas do Cliente
              </Heading>

              <Text className="text-sm text-ui-fg-subtle whitespace-pre-wrap">
                {quote.custom_details}
              </Text>
            </Container>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuoteDetails
