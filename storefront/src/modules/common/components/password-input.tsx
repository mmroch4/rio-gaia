"use client"

import { Eye, EyeOff } from "lucide-react"
import { InputHTMLAttributes, forwardRef, useState } from "react"

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  errors?: Record<string, string | undefined>
  touched?: Record<string, boolean | undefined>
  name: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, errors, touched, name, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const hasError = errors && touched && errors[name] && touched[name]

    return (
      <div className="flex flex-col gap-y-1">
        <label
          htmlFor={name}
          className="text-neutral-950 text-base-regular"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            name={name}
            id={name}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${hasError
              ? "border-rose-500 focus:ring-rose-500"
              : "border-neutral-200"
              } ${className || ""}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
            aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {hasError && (
          <span className="text-rose-500 text-sm mt-1">
            {errors[name]}
          </span>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export default PasswordInput
