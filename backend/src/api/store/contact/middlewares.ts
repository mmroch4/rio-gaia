import { validateAndTransformBody } from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import { contactFormRateLimiter } from "../../middlewares/rate-limiter";
import { StoreContactForm } from "./validators";

export const storeContactMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/contact",
    middlewares: [contactFormRateLimiter, validateAndTransformBody(StoreContactForm)],
  },
];
