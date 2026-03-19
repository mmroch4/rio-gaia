"use client"

interface PasswordStrengthProps {
  password: string
}

export type StrengthLevel = "weak" | "medium" | "strong"

export const checkPasswordStrength = (password: string): StrengthLevel => {
  let strength = 0

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return "weak"
  if (strength <= 4) return "medium"
  return "strong"
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  if (!password) return null

  const strength = checkPasswordStrength(password)

  const getStrengthColor = () => {
    switch (strength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      default:
        return "bg-neutral-200"
    }
  }

  const getStrengthText = () => {
    switch (strength) {
      case "weak":
        return "Fraca"
      case "medium":
        return "Média"
      case "strong":
        return "Forte"
      default:
        return ""
    }
  }

  const getStrengthWidth = () => {
    switch (strength) {
      case "weak":
        return "w-1/3"
      case "medium":
        return "w-2/3"
      case "strong":
        return "w-full"
      default:
        return "w-0"
    }
  }

  return (
    <div className="flex flex-col gap-y-1">
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
        />
      </div>
      <span className={`text-sm ${strength === "weak" ? "text-red-500" :
          strength === "medium" ? "text-yellow-600" :
            "text-green-600"
        }`}>
        Força da palavra-passe: {getStrengthText()}
      </span>
    </div>
  )
}

export default PasswordStrength
