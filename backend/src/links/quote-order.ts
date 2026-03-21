import { defineLink } from "@medusajs/framework/utils";
import QuoteModule from "../modules/quote";

export default defineLink(
  {
    linkable: QuoteModule.linkable.quote.id,
    field: "draft_order_id",
  },
  {
    linkable: {
      serviceName: "order",
      entity: "Order",
      primaryKey: "id",
      alias: "draft_order",
    },
  },
  {
    readOnly: true,
  }
);
