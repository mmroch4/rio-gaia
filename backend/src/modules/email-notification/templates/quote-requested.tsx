import { Button, Heading, Section, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { styles } from "./shared/email-styles"

interface QuoteRequestedEmailProps {
  quote: { id: string }
  portal_url: string
}

export const QuoteRequestedEmail = ({
  quote,
  portal_url,
}: QuoteRequestedEmailProps) => (
  <EmailLayout preview="Pedido de orçamento recebido">
    <Heading style={styles.heading}>Pedido de orçamento recebido</Heading>
    <Text style={styles.text}>
      O seu pedido de orçamento foi recebido com sucesso.
    </Text>
    <Text style={styles.text}>
      A nossa equipa irá analisá-lo e enviar-lhe uma proposta brevemente. Será
      notificado por email quando o orçamento estiver pronto para revisão.
    </Text>
    <Text style={{ ...styles.text, color: styles.footerText.color }}>
      Referência: {quote.id}
    </Text>
    <Section style={styles.buttonContainer}>
      <Button style={styles.button} href={portal_url}>
        Ver Orçamentos
      </Button>
    </Section>
  </EmailLayout>
)

export default QuoteRequestedEmail
