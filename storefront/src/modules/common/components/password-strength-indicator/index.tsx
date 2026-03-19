import { clx } from "@medusajs/ui"
import { useMemo } from "react"

interface PasswordStrengthIndicatorProps {
  password: string
  showCriteria?: boolean
}

interface StrengthCriteria {
  label: string
  met: boolean
}

interface StrengthResult {
  score: number
  label: string
  color: string
  criteria: StrengthCriteria[]
}

const calculatePasswordStrength = (password: string): StrengthResult => {
  const criteria: StrengthCriteria[] = [
    {
      label: "Mínimo de 8 caracteres",
      met: password.length >= 8,
    },
    {
      label: "Contém letra maiúscula",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contém letra minúscula",
      met: /[a-z]/.test(password),
    },
    {
      label: "Contém número",
      met: /[0-9]/.test(password),
    },
    {
      label: "Contém caractere especial",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ]

  const metCount = criteria.filter((c) => c.met).length
  let score = 0
  let label = ""
  let color = ""

  if (password.length === 0) {
    score = 0
    label = ""
    color = "bg-neutral-200"
  } else if (metCount <= 2) {
    score = 1
    label = "Fraca"
    color = "bg-red-500"
  } else if (metCount === 3) {
    score = 2
    label = "Razoável"
    color = "bg-orange-500"
  } else if (metCount === 4) {
    score = 3
    label = "Boa"
    color = "bg-yellow-500"
  } else {
    score = 4
    label = "Forte"
    color = "bg-green-500"
  }

  return { score, label, color, criteria }
}

const PasswordStrengthIndicator = ({
  password,
  showCriteria = false,
}: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  )

  if (!password) {
    return null
  }

  return (
    <div className="w-full space-y-2">
      {/* Strength bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={clx(
              "h-1 flex-1 rounded-full transition-all duration-300",
              level <= strength.score ? strength.color : "bg-neutral-200"
            )}
          />
        ))}
      </div>

      {/* Strength label */}
      {strength.label && (
        <p className="text-xs text-neutral-600">
          Força da palavra-passe: <span className="font-medium">{strength.label}</span>
        </p>
      )}

      {/* Criteria checklist */}
      {showCriteria && (
        <ul className="space-y-1 mt-2">
          {strength.criteria.map((criterion, index) => (
            <li
              key={index}
              className={clx(
                "text-xs flex items-center gap-2 transition-colors duration-200",
                criterion.met ? "text-green-600" : "text-neutral-500"
              )}
            >
              <span className="text-base">
                {criterion.met ? "✓" : "○"}
              </span>
              {criterion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PasswordStrengthIndicator
