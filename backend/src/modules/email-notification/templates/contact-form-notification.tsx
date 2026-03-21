import { Heading, Hr, Section, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { BRAND, styles } from "./shared/email-styles"

interface ContactFormNotificationEmailProps {
  name: string
  email: string
  phone?: string
  message: string
}

export const ContactFormNotificationEmail = ({
  name,
  email,
  phone,
  message,
}: ContactFormNotificationEmailProps) => (
  <EmailLayout preview={`Nova mensagem de contacto de ${name}`}>
    <Heading style={styles.heading}>Nova mensagem de contacto</Heading>
    <Text style={styles.text}>
      Foi recebida uma nova mensagem através do formulário de contacto do site.
    </Text>

    <Section
      style={{
        backgroundColor: BRAND.colors.background,
        borderRadius: "6px",
        padding: "16px 20px",
        margin: "0 0 16px",
      }}
    >
      <Text style={{ ...styles.text, margin: "0 0 8px" }}>
        <strong>Nome:</strong> {name}
      </Text>
      <Text style={{ ...styles.text, margin: "0 0 8px" }}>
        <strong>Email:</strong> {email}
      </Text>
      {phone && (
        <Text style={{ ...styles.text, margin: "0 0 8px" }}>
          <strong>Telefone:</strong> {phone}
        </Text>
      )}
    </Section>

    <Hr style={{ borderColor: BRAND.colors.border, margin: "0 0 16px" }} />

    <Text
      style={{ ...styles.text, fontWeight: "600", margin: "0 0 8px" }}
    >
      Mensagem:
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
      <Text style={{ ...styles.text, margin: "0", whiteSpace: "pre-wrap" }}>
        {message}
      </Text>
    </Section>

    <Text style={styles.footerText}>
      Para responder, envie um email diretamente para {email}.
    </Text>
  </EmailLayout>
)

export default ContactFormNotificationEmail
