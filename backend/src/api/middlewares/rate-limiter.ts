import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"

type RateLimitConfig = {
  windowMs: number
  max: number
  message?: string
}

type RateLimitEntry = {
  count: number
  resetTime: number
}

/**
 * Creates an IP-based rate limiter middleware compatible with MedusaJS's
 * wrapHandler. Uses the same async (req, res, next) signature as ensureRole.
 *
 * For multi-instance deployments behind a load balancer, replace the
 * in-memory Map with a Redis-backed store using the existing REDIS_URL.
 */
export const createRateLimiter = ({
  windowMs,
  max,
  message,
}: RateLimitConfig) => {
  const store = new Map<string, RateLimitEntry>()
  const errorMessage =
    message || "Demasiados pedidos. Tente novamente mais tarde."

  // Purge expired entries every 60 seconds to prevent memory leaks
  const cleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetTime) {
        store.delete(key)
      }
    }
  }, 60_000)
  cleanup.unref()

  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const forwarded = req.headers["x-forwarded-for"]
    const key =
      (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : null) ||
      req.ip ||
      "unknown"

    const now = Date.now()
    let entry = store.get(key)

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs }
      store.set(key, entry)
    }

    entry.count++

    const remaining = Math.max(0, max - entry.count)
    const resetSeconds = Math.ceil((entry.resetTime - now) / 1000)

    res.setHeader("RateLimit-Limit", max)
    res.setHeader("RateLimit-Remaining", remaining)
    res.setHeader("RateLimit-Reset", resetSeconds)

    if (entry.count > max) {
      res.setHeader("Retry-After", resetSeconds)
      res.status(429).json({
        type: "rate_limit",
        message: errorMessage,
      })
      return
    }

    next()
  }
}

/** Auth endpoints (login, register, password reset): 10 requests per 15 minutes per IP */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message:
    "Demasiadas tentativas de autenticação. Tente novamente em 15 minutos.",
})

/** Quote creation: 5 requests per hour per IP */
export const quoteCreationRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
    "Limite de pedidos de orçamento atingido. Tente novamente mais tarde.",
})

/** Contact form: 3 requests per hour per IP */
export const contactFormRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message:
    "Limite de envios do formulário de contacto atingido. Tente novamente mais tarde.",
})
