import { MiddlewareRoute, validateAndTransformBody } from "@medusajs/framework"
import { validateScopeProviderAssociation } from "./utils/validate-scope-provider-association"
import { validateToken } from "./utils/validate-token"
import { ResetPasswordRequest } from "./validators"

export const vendorMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/vendor/auth/:actor_type/:auth_provider/reset-password",
    middlewares: [
      validateScopeProviderAssociation(),
      validateAndTransformBody(ResetPasswordRequest),
    ],
  },
  {
    method: ["POST"],
    matcher: "/vendor/auth/:actor_type/:auth_provider/update",
    middlewares: [validateScopeProviderAssociation(), validateToken()],
  },
]