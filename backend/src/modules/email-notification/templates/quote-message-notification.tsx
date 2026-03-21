import { Button, Heading, Section, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { BRAND, styles } from "./shared/email-styles"

interface QuoteMessageNotificationEmailProps {
  quote: { id: string }
  message_text: string
  sender_name: string
  portal_url: string
}

export const QuoteMessageNotificationEmail = ({
  quote,
  message_text,
  sender_name,
  portal_url,
}: QuoteMessageNotificationEmailProps) => (
  <EmailLayout preview="Nova mensagem no orçamento">
    <Heading style={styles.heading}>Nova mensagem no orçamento</Heading>
    <Text style={styles.text}>
      <strong>{sender_name}</strong> enviou uma mensagem sobre o seu orçamento:
    </Text>
    <Section
      style={{
        backgroundColor: BRAND.colors.background,
        borderLeft: `3px solid ${BRAND.colors.primary}`,
        borderRadius: "4px",
        padding: "16px 20px",
        margin: "0 0 16px",
      }}
    >
      <Text
        style={{
          ...styles.text,
          margin: "0",
          fontStyle: "italic",
        }}
      >
        {message_text}
      </Text>
    </Section>
    <Section style={styles.buttonContainer}>
      <Button style={styles.button} href={portal_url}>
        Ver Orçamento
      </Button>
    </Section>
    <Text style={{ ...styles.footerText, marginTop: "8px" }}>
      Referência: {quote.id}
    </Text>
  </EmailLayout>
)

export default QuoteMessageNotificationEmail
