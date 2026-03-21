import { MiddlewareRoute } from "@medusajs/medusa";
import { storeCartsMiddlewares } from "./carts/middlewares";
import { storeCompaniesMiddlewares } from "./companies/middlewares";
import { storeContactMiddlewares } from "./contact/middlewares";
import { storeFreeShippingMiddlewares } from "./free-shipping/middlewares";
import { storeQuotesMiddlewares } from "./quotes/middlewares";

export const storeMiddlewares: MiddlewareRoute[] = [
  ...storeCartsMiddlewares,
  ...storeCompaniesMiddlewares,
  ...storeContactMiddlewares,
  ...storeQuotesMiddlewares,
  ...storeFreeShippingMiddlewares,
];
