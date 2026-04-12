import { emitEventStep, useRemoteQueryStep } from "@medusajs/core-flows";
import { createWorkflow, transform } from "@medusajs/workflows-sdk";
import { updateQuotesWorkflow } from "./update-quote";

/*
  A workflow that sends a quote to the customer.

  A merchant can perform any changes that the customer requests or the merchant deems necessary through the
  order edit functionality of the draft order. Once its ready for review, the merchant can then send
  it over to the customer.
*/
export const merchantSendQuoteWorkflow = createWorkflow(
  "merchant-send-quote-workflow",
  function (input: { quote_id: string }) {
    const quote = useRemoteQueryStep({
      entry_point: "quote",
      fields: [
        "id",
        "shipping_cost",
        "customer.email",
        "customer.first_name",
        "customer.last_name",
        "draft_order.id",
        "draft_order.display_id",
        "draft_order.currency_code",
        "draft_order.total",
        "draft_order.subtotal",
        "draft_order.tax_total",
        "draft_order.shipping_total",
        "draft_order.items.*",
        "draft_order.items.variant.product.title",
      ],
      variables: { id: input.quote_id },
      list: false,
      throw_if_key_not_found: true,
    });

    updateQuotesWorkflow.runAsStep({
      input: [
        {
          id: input.quote_id,
          status: "pending_customer",
        },
      ],
    });

    const eventData = transform({ quote }, ({ quote }) => ({
      quote_id: quote.id,
      quote: {
        id: quote.id,
        shipping_cost: quote.shipping_cost,
        customer: quote.customer,
        draft_order: quote.draft_order,
      },
      customer_email: quote.customer?.email,
    }));

    emitEventStep({
      eventName: "quote.sent",
      data: eventData,
    });
  }
);
