import { Button, Heading, Section, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { styles } from "./shared/email-styles"

interface QuoteAcceptedEmailProps {
  quote: {
    id: string
    draft_order?: { display_id?: number }
  }
  portal_url: string
}

export const QuoteAcceptedEmail = ({
  quote,
  portal_url,
}: QuoteAcceptedEmailProps) => {
  const displayId = quote.draft_order?.display_id

  return (
    <EmailLayout preview="Orçamento aceite — encomenda criada">
      <Heading style={styles.heading}>Orçamento aceite</Heading>
      <Text style={styles.text}>
        O seu orçamento foi aceite com sucesso
        {displayId ? ` e a encomenda #${displayId} foi criada` : ""}.
      </Text>
      <Text style={styles.text}>
        A sua encomenda será processada pela nossa equipa. Pode acompanhar o
        estado da encomenda no portal.
      </Text>
      <Section style={styles.buttonContainer}>
        <Button style={styles.button} href={portal_url}>
          Ver Encomendas
        </Button>
      </Section>
      <Text style={{ ...styles.footerText, marginTop: "8px" }}>
        Referência do orçamento: {quote.id}
      </Text>
    </EmailLayout>
  )
}

export default QuoteAcceptedEmail
