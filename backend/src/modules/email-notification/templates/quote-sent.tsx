import {
  Button,
  Column,
  Heading,
  Hr,
  Row,
  Section,
  Text,
} from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { BRAND, styles } from "./shared/email-styles"

interface QuoteItem {
  quantity: number
  unit_price: number
  variant?: { product?: { title?: string } }
}

interface QuoteSentEmailProps {
  quote: {
    id: string
    draft_order?: {
      display_id?: number
      currency_code?: string
      total?: number
      subtotal?: number
      tax_total?: number
      shipping_total?: number
      items?: QuoteItem[]
    }
  }
  portal_url: string
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: currency || "EUR",
  }).format(amount)
}

export const QuoteSentEmail = ({
  quote,
  portal_url,
}: QuoteSentEmailProps) => {
  const order = quote.draft_order
  const currency = order?.currency_code || "EUR"
  const items = order?.items || []

  return (
    <EmailLayout preview="O seu orçamento está pronto para revisão">
      <Heading style={styles.heading}>
        O seu orçamento está pronto
      </Heading>
      <Text style={styles.text}>
        A nossa equipa preparou o orçamento para o seu pedido. Consulte os
        detalhes abaixo e aceda ao portal para aceitar ou solicitar alterações.
      </Text>

      {items.length > 0 && (
        <Section style={{ margin: "0 0 16px" }}>
          <Text
            style={{
              ...styles.text,
              fontWeight: "600",
              margin: "0 0 8px",
            }}
          >
            Itens:
          </Text>
          {items.map((item, i) => (
            <Row key={i} style={{ marginBottom: "4px" }}>
              <Column style={{ width: "70%" }}>
                <Text
                  style={{
                    ...styles.text,
                    margin: "0",
                    fontSize: "14px",
                  }}
                >
                  {item.variant?.product?.title || "Produto"} × {item.quantity}
                </Text>
              </Column>
              <Column style={{ width: "30%", textAlign: "right" }}>
                <Text
                  style={{
                    ...styles.text,
                    margin: "0",
                    fontSize: "14px",
                  }}
                >
                  {formatPrice(item.unit_price * item.quantity, currency)}
                </Text>
              </Column>
            </Row>
          ))}
        </Section>
      )}

      {order && (
        <Section
          style={{
            backgroundColor: BRAND.colors.background,
            borderRadius: "6px",
            padding: "16px",
            margin: "0 0 16px",
          }}
        >
          <Hr
            style={{
              borderColor: BRAND.colors.border,
              margin: "0 0 12px",
            }}
          />
          {order.subtotal != null && (
            <Row>
              <Column>
                <Text style={{ ...styles.text, margin: "0", fontSize: "14px" }}>
                  Subtotal
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ ...styles.text, margin: "0", fontSize: "14px" }}>
                  {formatPrice(order.subtotal, currency)}
                </Text>
              </Column>
            </Row>
          )}
          {order.shipping_total != null && order.shipping_total > 0 && (
            <Row>
              <Column>
                <Text style={{ ...styles.text, margin: "0", fontSize: "14px" }}>
                  Envio
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ ...styles.text, margin: "0", fontSize: "14px" }}>
                  {formatPrice(order.shipping_total, currency)}
                </Text>
              </Column>
            </Row>
          )}
          {order.tax_total != null && order.tax_total > 0 && (
            <Row>
              <Column>
                <Text style={{ ...styles.text, margin: "0", fontSize: "14px" }}>
                  IVA
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ ...styles.text, margin: "0", fontSize: "14px" }}>
                  {formatPrice(order.tax_total, currency)}
                </Text>
              </Column>
            </Row>
          )}
          {order.total != null && (
            <Row style={{ marginTop: "8px" }}>
              <Column>
                <Text
                  style={{
                    ...styles.text,
                    margin: "0",
                    fontWeight: "bold",
                  }}
                >
                  Total
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text
                  style={{
                    ...styles.text,
                    margin: "0",
                    fontWeight: "bold",
                  }}
                >
                  {formatPrice(order.total, currency)}
                </Text>
              </Column>
            </Row>
          )}
        </Section>
      )}

      <Section style={styles.buttonContainer}>
        <Button style={styles.button} href={portal_url}>
          Rever Orçamento
        </Button>
      </Section>

      <Text style={{ ...styles.footerText, marginTop: "8px" }}>
        Referência: {quote.id}
      </Text>
    </EmailLayout>
  )
}

export default QuoteSentEmail
