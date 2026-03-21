const RATE_LIMIT_STATUS = 429
const DEFAULT_MESSAGE =
  "Demasiados pedidos. Tente novamente mais tarde."

/**
 * Checks if an error is a 429 rate limit response from the backend.
 * Works with Medusa SDK's FetchError (has a `status` property).
 */
export function isRateLimitError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "status" in error &&
    (error as any).status === RATE_LIMIT_STATUS
  )
}

/**
 * Extracts the Portuguese rate limit message from the error.
 * The backend returns `{ type: "rate_limit", message: "..." }` as the body,
 * which the Medusa SDK includes in the FetchError message.
 */
export function getRateLimitMessage(error: unknown): string {
  if (!(error instanceof Error)) return DEFAULT_MESSAGE

  try {
    const parsed = JSON.parse(error.message)
    if (parsed?.message) return parsed.message
  } catch {
    // message is not JSON — may be a plain string from the SDK
    if (error.message && error.message !== "string") return error.message
  }

  return DEFAULT_MESSAGE
}
