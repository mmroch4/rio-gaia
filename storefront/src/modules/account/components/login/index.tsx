import { login } from "@/lib/data/customer"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Checkbox, Text } from "@medusajs/ui"
import { useActionState } from "react"

interface LoginProps {
  countryCode: string
}

const Login = ({ countryCode }: LoginProps) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="w-full flex flex-col gap-6"
      data-testid="login-page"
    >
      <Text className="text-4xl text-neutral-950 text-left">
        Iniciar Sessão
      </Text>

      <Text className="text-neutral-600 text-base-regular">
        Aceda à sua conta empresarial
      </Text>

      {message && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4" data-testid="login-error-message">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">Erro ao iniciar sessão</h4>
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
          <Input
            label="Palavra-passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
          <input type="hidden" name="country_code" value={countryCode} />
          <LocalizedClientLink
            href="/conta/recuperar-password"
            className="text-sm text-[#0047AB] hover:text-[#003685] hover:underline self-end"
            data-testid="forgot-password-link"
          >
            Esqueceu a palavra-passe?
          </LocalizedClientLink>

          <div className="flex items-center gap-2 mt-2">
            <Checkbox name="remember_me" data-testid="remember-me-checkbox" />
            <Text className="text-neutral-700 text-base-regular">
              Lembrar-me
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <SubmitButton
            data-testid="sign-in-button"
            className="w-full h-10 !bg-[#0047AB] hover:!bg-[#003685] text-white transition-colors"
          >
            Entrar
          </SubmitButton>

          <div className="text-center text-neutral-600 text-sm">
            Ainda não tem conta?
          </div>

          <LocalizedClientLink href="/conta/registar">
            <Button
              variant="secondary"
              className="w-full h-10"
              data-testid="register-button"
            >
              Criar Conta
            </Button>
          </LocalizedClientLink>
        </div>
      </form>
    </div>
  )
}

export default Login
