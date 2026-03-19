"use client"

import { resetPassword } from "@/lib/data/customer"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import PasswordStrengthIndicator from "@/modules/common/components/password-strength-indicator"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Text } from "@medusajs/ui"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"

const ResetPasswordPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, formAction] = useActionState(resetPassword, null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const countryCode = 'pt'

  useEffect(() => {
    if (message && typeof message === "object" && "success" in message) {
      setShowSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(`/${countryCode}/account/login`)
      }, 3000)
    }
  }, [message, router, countryCode])

  if (!token || !email) {
    return (
      <div>
        <Header />
        <section className="min-h-screen bg-gray-50">
          <div className="grid lg:grid-cols-2 min-h-screen">
            <div className="flex items-center justify-center bg-neutral-100 px-4 sm:px-6 lg:px-8 py-12">
              <div className="w-full max-w-md">
                <div className="flex flex-col gap-6 my-auto">
                  <Text className="text-4xl text-neutral-950 text-left">
                    Link inválido
                  </Text>
                  <Text className="text-neutral-600 text-base-regular">
                    Este link de redefinição de palavra-passe é inválido ou expirou.
                  </Text>
                  <LocalizedClientLink href="/account/forgot-password">
                    <Button variant="primary" className="w-full h-10 !bg-[#0047AB] hover:!bg-[#003685]">
                      Solicitar novo link
                    </Button>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex relative text-white overflow-hidden bg-gradient-to-br from-[#0047AB] via-[#0047AB] to-[#003685]">
              <div className="flex items-center justify-center w-full px-8 lg:px-12">
                <div className="max-w-lg">
                  <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
                    Link Expirado
                  </div>
                  <h1 className="text-white mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.1', fontWeight: '700' }}>
                    Solicite um Novo Link
                  </h1>
                  <p className="text-xl text-blue-100">
                    Por razões de segurança, os links de redefinição de palavra-passe expiram após algum tempo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />

      {/* Two-Column Layout Section */}
      <section className="min-h-screen bg-gray-50">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Column - Form */}
          <div className="flex items-center justify-center bg-neutral-100 px-4 sm:px-6 lg:px-8 py-12">
            <div className="w-full max-w-md">
              <div className="flex flex-col gap-6 my-auto" data-testid="reset-password-page">
                <Text className="text-4xl text-neutral-950 text-left">
                  Redefinir palavra-passe
                </Text>

                {showSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-green-800 mb-1">Palavra-passe redefinida com sucesso!</h4>
                        <p className="text-sm text-green-700">A redirecionar para o login...</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Text className="text-neutral-600 text-base-regular">
                      Introduza a sua nova palavra-passe para a conta: <strong>{email}</strong>
                    </Text>

                    {message && typeof message === "string" && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-red-800 mb-1">Erro</h4>
                            <p className="text-sm text-red-700">{message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form className="w-full" action={formAction}>
                      <input type="hidden" name="token" value={token} readOnly />
                      <input type="hidden" name="email" value={email} readOnly />
                      <input type="hidden" name="country_code" value={countryCode} readOnly />

                      <div className="flex flex-col w-full gap-y-4">
                        <Input
                          label="Nova palavra-passe"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          data-testid="password-input"
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <PasswordStrengthIndicator
                          password={password}
                          showCriteria={true}
                        />

                        <Input
                          label="Confirmar palavra-passe"
                          name="confirm_password"
                          type="password"
                          autoComplete="new-password"
                          required
                          data-testid="confirm-password-input"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {password && confirmPassword && password !== confirmPassword && (
                          <Text className="text-rose-500 text-sm">
                            As palavras-passe não coincidem.
                          </Text>
                        )}

                        <div className="flex flex-col gap-2 mt-2">
                          <SubmitButton data-testid="submit-button" className="w-full h-10 !bg-[#0047AB] hover:!bg-[#003685] text-white transition-colors">
                            Redefinir palavra-passe
                          </SubmitButton>
                          <LocalizedClientLink href="/account/login">
                            <Button
                              variant="secondary"
                              className="w-full h-10"
                              data-testid="back-to-login-button"
                            >
                              Voltar ao login
                            </Button>
                          </LocalizedClientLink>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Decorative Visual */}
          <div className="hidden lg:flex relative text-white overflow-hidden bg-gradient-to-br from-[#0047AB] via-[#0047AB] to-[#003685]">
            <div className="flex items-center justify-center w-full px-8 lg:px-12">
              <div className="max-w-lg">
                <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
                  Nova Palavra-passe
                </div>

                <h1 className="text-white mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.1', fontWeight: '700' }}>
                  Crie uma Palavra-passe Segura
                </h1>

                <p className="text-xl text-blue-100 mb-8">
                  Escolha uma palavra-passe forte para proteger a sua conta empresarial
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Mínimo 8 Caracteres</div>
                      <div className="text-blue-100 text-sm">Use uma combinação de letras, números e símbolos</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Segurança Reforçada</div>
                      <div className="text-blue-100 text-sm">Proteja os dados da sua empresa</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Acesso Imediato</div>
                      <div className="text-blue-100 text-sm">Entre na sua conta após redefinir</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ResetPasswordPage
