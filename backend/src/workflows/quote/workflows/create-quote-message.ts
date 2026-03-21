import {
  emitEventStep,
  useRemoteQueryStep,
} from "@medusajs/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { ModuleCreateQuoteMessage, ModuleQuoteMessage } from "../../../types";
import { createQuoteMessageStep } from "../steps/create-quote-message";

/*
  A workflow that creates messages within a quote. Messages are used as a communication trail
  between the merchant and the customer. The message can also hold an item_id for either of the
  actors to have a conversation around or negotiate upon.
*/
export const createQuoteMessageWorkflow = createWorkflow(
  "create-quote-message-workflow",
  function (
    input: ModuleCreateQuoteMessage
  ): WorkflowResponse<ModuleQuoteMessage> {
    const message = createQuoteMessageStep(input);

    const quote = useRemoteQueryStep({
      entry_point: "quote",
      fields: [
        "id",
        "customer.email",
        "customer.first_name",
        "customer.last_name",
      ],
      variables: { id: input.quote_id },
      list: false,
      throw_if_key_not_found: true,
    });

    const eventData = transform(
      { quote, input, message },
      ({ quote, input, message }) => ({
        quote_id: quote.id,
        quote: {
          id: quote.id,
          customer: quote.customer,
        },
        customer_email: quote.customer?.email,
        message: {
          text: input.text,
          admin_id: input.admin_id,
          customer_id: input.customer_id,
        },
        sender_role: input.admin_id ? "admin" : "customer",
      })
    );

    emitEventStep({
      eventName: "quote.message_created",
      data: eventData,
    });

    return new WorkflowResponse(message);
  }
);
