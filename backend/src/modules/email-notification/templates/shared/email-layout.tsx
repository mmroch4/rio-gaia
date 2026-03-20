import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { BRAND, styles } from "./email-styles"

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Section style={styles.header}>
          <Text style={styles.headerText}>{BRAND.name}</Text>
        </Section>

        <Section style={styles.content}>{children}</Section>

        <Section style={styles.footer}>
          <Text style={styles.footerText}>{BRAND.legalName}</Text>
          <Text style={styles.footerText}>{BRAND.address}</Text>
          <Text style={styles.footerText}>
            {BRAND.phone} · {BRAND.email}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailLayout
