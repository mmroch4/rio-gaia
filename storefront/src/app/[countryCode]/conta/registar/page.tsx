import { listRegions } from "@/lib/data/regions"
import RegisterTemplate from "@/modules/account/templates/register-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registar",
  description: "Registe-se para um checkout mais rápido.",
}

export default async function Register(props: {
  params: Promise<{ countryCode: string }>
}) {
  const regions = await listRegions()

  const params = await props.params
  const { countryCode } = params

  return <RegisterTemplate regions={regions} countryCode={countryCode} />
}
