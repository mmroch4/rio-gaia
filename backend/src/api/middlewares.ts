import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import { adminMiddlewares } from "./admin/middlewares";
import { authRateLimiter } from "./middlewares/rate-limiter";
import { storeMiddlewares } from "./store/middlewares";
import { vendorMiddlewares } from "./vendor/middlewares";

export default defineMiddlewares({
  routes: [
    ...adminMiddlewares,
    ...storeMiddlewares,
    ...vendorMiddlewares,
    {
      method: ["POST"],
      matcher: "/auth/customer/:auth_provider",
      middlewares: [authRateLimiter],
    },
    {
      method: ["POST"],
      matcher: "/auth/customer/:auth_provider/register",
      middlewares: [authRateLimiter],
    },
    {
      matcher: "/store/customers/me",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          req.allowed = ["employee"];
          next();
        },
      ],
    },
  ],
});
