"use client"

import Register from "@/modules/account/components/register"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { HttpTypes } from "@medusajs/types"

type RegisterTemplateProps = { regions: HttpTypes.StoreRegion[], countryCode: string }

const RegisterTemplate = ({ regions, countryCode }: RegisterTemplateProps) => {
  return (
    <div>
      <Header />

      {/* Two-Column Layout Section */}
      <section className="min-h-screen bg-gray-50">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Column - Form */}
          <div className="flex items-center justify-center bg-neutral-100 px-4 sm:px-6 lg:px-8 py-12">
            <div className="w-full max-w-xl">
              <div className="flex flex-col gap-6 my-auto">
                <Register regions={regions} countryCode={countryCode} />
              </div>
            </div>
          </div>

          {/* Right Column - Decorative Visual */}
          <div className="hidden lg:flex relative text-white overflow-hidden bg-gradient-to-br from-[#0047AB] via-[#0047AB] to-[#003685]">
            <div className="flex items-center justify-center w-full px-8 lg:px-12">
              <div className="max-w-lg">
                <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
                  Criar Conta
                </div>

                <h1 className="text-white mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.1', fontWeight: '700' }}>
                  Junte-se à Rio Gaia
                </h1>

                <p className="text-xl text-blue-100 mb-8">
                  Crie a sua conta empresarial e aceda a catálogos exclusivos e preços especiais
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Catálogos Exclusivos</div>
                      <div className="text-blue-100 text-sm">Acesso a produtos personalizados para o seu negócio</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Preços Especiais B2B</div>
                      <div className="text-blue-100 text-sm">Condições comerciais adaptadas ao seu volume</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Gestão Simplificada</div>
                      <div className="text-blue-100 text-sm">Acompanhe encomendas e orçamentos num só lugar</div>
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

export default RegisterTemplate
