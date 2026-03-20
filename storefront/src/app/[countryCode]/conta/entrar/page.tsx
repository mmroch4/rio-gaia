import LoginTemplate from "@/modules/account/templates/login-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar sessão",
  description: "Inicie sessão na sua conta Rio Gaia.",
}

export default async function Login(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ session_expired?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { countryCode } = params

  return (
    <LoginTemplate
      countryCode={countryCode}
      sessionExpired={searchParams.session_expired === "true"}
    />
  )
}
