import { Heading, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { styles } from "./shared/email-styles"

type QuoteEventType = "requested" | "accepted" | "customer_rejected"

interface QuoteAdminNotificationEmailProps {
  quote: {
    id: string
    customer?: {
      first_name?: string
      last_name?: string
      email?: string
    }
  }
  event_type: QuoteEventType
}

const eventContent: Record<
  QuoteEventType,
  { heading: string; preview: string; message: string }
> = {
  requested: {
    heading: "Novo pedido de orçamento",
    preview: "Novo pedido de orçamento recebido",
    message:
      "Foi recebido um novo pedido de orçamento. Aceda ao painel de administração para analisar e preparar a proposta.",
  },
  accepted: {
    heading: "Orçamento aceite pelo cliente",
    preview: "Orçamento aceite — encomenda criada",
    message:
      "O cliente aceitou o orçamento e a encomenda foi criada. Aceda ao painel de administração para processar a encomenda.",
  },
  customer_rejected: {
    heading: "Orçamento recusado pelo cliente",
    preview: "Orçamento recusado pelo cliente",
    message:
      "O cliente recusou o orçamento. Pode rever o pedido no painel de administração e, se aplicável, preparar uma nova proposta.",
  },
}

export const QuoteAdminNotificationEmail = ({
  quote,
  event_type,
}: QuoteAdminNotificationEmailProps) => {
  const content = eventContent[event_type] || eventContent.requested
  const customerName = [
    quote.customer?.first_name,
    quote.customer?.last_name,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <EmailLayout preview={content.preview}>
      <Heading style={styles.heading}>{content.heading}</Heading>
      <Text style={styles.text}>{content.message}</Text>
      <Text style={styles.text}>
        <strong>Orçamento:</strong> {quote.id}
        <br />
        <strong>Cliente:</strong>{" "}
        {customerName || quote.customer?.email || "—"}
        {customerName && quote.customer?.email && (
          <> ({quote.customer.email})</>
        )}
      </Text>
    </EmailLayout>
  )
}

export default QuoteAdminNotificationEmail
