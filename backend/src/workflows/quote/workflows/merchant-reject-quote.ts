import { emitEventStep, useRemoteQueryStep } from "@medusajs/core-flows";
import { createWorkflow, transform } from "@medusajs/workflows-sdk";
import { QueryQuote } from "../../../types";
import { validateQuoteRejectionStep } from "../steps/validate-quote-rejection";
import { updateQuotesWorkflow } from "./update-quote";

/*
  A workflow that rejects a quote by a merchant. 
  
  Once the merchant rejects the quote, we update the status of the quote to a rejection by merchant.
*/
export const merchantRejectQuoteWorkflow = createWorkflow(
  "merchant-reject-quote-workflow",
  function (input: { quote_id: string }) {
    const quote: QueryQuote = useRemoteQueryStep({
      entry_point: "quote",
      fields: ["id", "status", "customer.email"],
      variables: { id: input.quote_id },
      list: false,
      throw_if_key_not_found: true,
    });

    validateQuoteRejectionStep({ quote });

    updateQuotesWorkflow.runAsStep({
      input: [
        {
          id: input.quote_id,
          status: "merchant_rejected",
        },
      ],
    });

    const eventData = transform({ quote }, ({ quote }) => ({
      quote_id: quote.id,
      quote: {
        id: quote.id,
        customer: quote.customer,
      },
      customer_email: quote.customer?.email,
    }));

    emitEventStep({
      eventName: "quote.merchant_rejected",
      data: eventData,
    });
  }
);
