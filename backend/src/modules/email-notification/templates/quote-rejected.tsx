import { Button, Heading, Section, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { BRAND, styles } from "./shared/email-styles"

interface QuoteRejectedEmailProps {
  quote: { id: string }
  portal_url: string
}

export const QuoteRejectedEmail = ({
  quote,
  portal_url,
}: QuoteRejectedEmailProps) => (
  <EmailLayout preview="Atualização do seu pedido de orçamento">
    <Heading style={styles.heading}>
      Atualização do pedido de orçamento
    </Heading>
    <Text style={styles.text}>
      Lamentamos informar que o seu pedido de orçamento não pôde ser aprovado
      neste momento.
    </Text>
    <Text style={styles.text}>
      Para mais informações ou para submeter um novo pedido, por favor
      contacte-nos ou aceda ao portal.
    </Text>
    <Section style={styles.buttonContainer}>
      <Button style={styles.button} href={portal_url}>
        Ver Orçamentos
      </Button>
    </Section>
    <Text style={{ ...styles.footerText, marginTop: "8px" }}>
      Referência: {quote.id}
    </Text>
    <Text style={styles.footerText}>
      Contacto: {BRAND.email} | {BRAND.phone}
    </Text>
  </EmailLayout>
)

export default QuoteRejectedEmail
