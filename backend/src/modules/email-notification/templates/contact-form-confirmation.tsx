import { Heading, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { BRAND, styles } from "./shared/email-styles"

interface ContactFormConfirmationEmailProps {
  name: string
}

export const ContactFormConfirmationEmail = ({
  name,
}: ContactFormConfirmationEmailProps) => (
  <EmailLayout preview="Mensagem recebida — Rio Gaia">
    <Heading style={styles.heading}>Mensagem recebida</Heading>
    <Text style={styles.text}>
      Olá {name}, obrigado por nos contactar.
    </Text>
    <Text style={styles.text}>
      Recebemos a sua mensagem e a nossa equipa irá responder o mais
      brevemente possível.
    </Text>
    <Text style={styles.text}>
      Se necessitar de uma resposta urgente, pode contactar-nos diretamente:
    </Text>
    <Text style={styles.text}>
      <strong>Email:</strong> {BRAND.email}
      <br />
      <strong>Telefone:</strong> {BRAND.phone}
    </Text>
  </EmailLayout>
)

export default ContactFormConfirmationEmail
