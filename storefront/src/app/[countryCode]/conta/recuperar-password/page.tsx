"use client"

import { requestPasswordReset } from "@/lib/data/customer"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Text } from "@medusajs/ui"
import { useActionState, useEffect, useState } from "react"

const ForgotPasswordPage = () => {
  const [message, formAction] = useActionState(requestPasswordReset, null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (message && typeof message === "object" && "success" in message) {
      setShowSuccess(true)
    }
  }, [message])

  return (
    <div>
      <Header />

      {/* Two-Column Layout Section */}
      <section className="min-h-screen bg-gray-50">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Column - Form */}
          <div className="flex items-center justify-center bg-neutral-100 px-4 sm:px-6 lg:px-8 py-12">
            <div className="w-full max-w-md">
              <div className="flex flex-col gap-6 my-auto" data-testid="forgot-password-page">
                <Text className="text-4xl text-neutral-950 text-left">
                  Esqueceu a palavra-passe?
                </Text>

                {showSuccess ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-green-800 mb-1">Email enviado com sucesso</h4>
                          <p className="text-sm text-green-700">Verifique o seu email para instruções de redefinição da palavra-passe.</p>
                        </div>
                      </div>
                    </div>
                    <LocalizedClientLink href="/account/login">
                      <Button variant="secondary" className="w-full h-10">
                        Voltar ao login
                      </Button>
                    </LocalizedClientLink>
                  </>
                ) : (
                  <>
                    <Text className="text-neutral-600 text-base-regular">
                      Introduza o seu email e enviaremos um link para redefinir a sua palavra-passe.
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
                      <div className="flex flex-col w-full gap-y-4">
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          title="Enter a valid email address."
                          autoComplete="email"
                          required
                          data-testid="email-input"
                        />

                        <div className="flex flex-col gap-2 mt-2">
                          <SubmitButton data-testid="submit-button" className="w-full h-10 !bg-[#0047AB] hover:!bg-[#003685] text-white transition-colors">
                            Enviar link de redefinição
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
                  Recuperação de Palavra-passe
                </div>

                <h1 className="text-white mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.1', fontWeight: '700' }}>
                  Recupere o Acesso à Sua Conta
                </h1>

                <p className="text-xl text-blue-100 mb-8">
                  Enviaremos um link seguro para o seu email para redefinir a sua palavra-passe
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Link Seguro</div>
                      <div className="text-blue-100 text-sm">Receberá um link único e seguro no seu email</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Processo Rápido</div>
                      <div className="text-blue-100 text-sm">Redefina a sua palavra-passe em poucos minutos</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Totalmente Seguro</div>
                      <div className="text-blue-100 text-sm">Processo protegido e encriptado</div>
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

export default ForgotPasswordPage
