import { validateAndTransformBody } from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import { StoreContactForm } from "./validators";

export const storeContactMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/contact",
    middlewares: [validateAndTransformBody(StoreContactForm)],
  },
];
