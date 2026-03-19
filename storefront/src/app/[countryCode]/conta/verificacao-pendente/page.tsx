import NeedVerificationTemplate from "@/modules/account/templates/need-verification-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verificação Pendente",
  description: "A sua conta de empresa está pendente de verificação.",
}

export default async function NeedVerification() {
  return <NeedVerificationTemplate />
}
