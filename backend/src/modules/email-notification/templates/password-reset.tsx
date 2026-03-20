import { Button, Heading, Section, Text } from "@react-email/components"
import { EmailLayout } from "./shared/email-layout"
import { styles } from "./shared/email-styles"

interface PasswordResetEmailProps {
  resetUrl: string
  email?: string
}

export const PasswordResetEmail = ({
  resetUrl,
  email,
}: PasswordResetEmailProps) => (
  <EmailLayout preview="Redefinir a sua palavra-passe">
    <Heading style={styles.heading}>Redefinir palavra-passe</Heading>
    <Text style={styles.text}>Olá{email ? ` ${email}` : ""},</Text>
    <Text style={styles.text}>
      Recebemos um pedido para redefinir a palavra-passe da sua conta. Se foi
      você, clique no botão abaixo para definir uma nova palavra-passe:
    </Text>
    <Section style={styles.buttonContainer}>
      <Button style={styles.button} href={resetUrl}>
        Redefinir Palavra-passe
      </Button>
    </Section>
    <Text style={styles.text}>
      Se não solicitou esta alteração, pode ignorar este email.
    </Text>
    <Text style={{ ...styles.footerText, marginTop: "16px" }}>
      Este link expira em 15 minutos por razões de segurança.
    </Text>
    <Text style={styles.link}>{resetUrl}</Text>
  </EmailLayout>
)

export default PasswordResetEmail
