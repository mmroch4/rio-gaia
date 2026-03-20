export const BRAND = {
  name: "Rio Gaia",
  legalName: "Rio Gaia Unipessoal Lda",
  email: "geral@riogaia.com",
  phone: "+351 966 764 605",
  website: "https://riogaia.com/pt",
  address:
    "Rua Fábrica da Lã 179 3° DTO FRENTE, Vila Nova de Gaia, 4400-706 Porto",
  colors: {
    primary: "#0047AB",
    primaryDark: "#003685",
    text: "#333333",
    textMuted: "#6b7280",
    background: "#f4f4f5",
    surface: "#ffffff",
    border: "#e5e7eb",
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
} as const

export const styles = {
  main: {
    backgroundColor: BRAND.colors.background,
    fontFamily: BRAND.fontFamily,
  },
  container: {
    backgroundColor: BRAND.colors.surface,
    margin: "0 auto",
    padding: "0",
    maxWidth: "600px",
    borderRadius: "8px",
    overflow: "hidden" as const,
  },
  header: {
    backgroundColor: BRAND.colors.primary,
    padding: "24px 32px",
    textAlign: "center" as const,
  },
  headerText: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "bold" as const,
    margin: "0",
  },
  content: {
    padding: "32px 40px",
  },
  heading: {
    color: BRAND.colors.text,
    fontSize: "22px",
    fontWeight: "bold" as const,
    margin: "0 0 16px",
  },
  text: {
    color: BRAND.colors.text,
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px",
  },
  button: {
    backgroundColor: BRAND.colors.primary,
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "12px 24px",
    boxSizing: "border-box",
  },
  buttonContainer: {
    padding: "8px 0 16px",
  },
  footer: {
    borderTop: `1px solid ${BRAND.colors.border}`,
    padding: "24px 40px",
  },
  footerText: {
    color: BRAND.colors.textMuted,
    fontSize: "12px",
    lineHeight: "18px",
    margin: "0 0 4px",
  },
  link: {
    color: BRAND.colors.primary,
    fontSize: "12px",
    lineHeight: "18px",
    wordBreak: "break-all" as const,
  },
} as const
