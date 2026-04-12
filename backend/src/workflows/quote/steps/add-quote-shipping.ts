import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { IOrderModuleService } from "@medusajs/framework/types";

type AddQuoteShippingInput = {
  order_id: string;
  shipping_cost: number | null | undefined;
};

/**
 * Adds a shipping method directly to the finalized order using the quote's shipping_cost.
 * Uses `is_tax_inclusive: true` so the admin-set amount is the final charge (no tax added on top).
 * If shipping_cost is null/undefined, this step is a no-op.
 */
export const addQuoteShippingStep = createStep(
  "add-quote-shipping-step",
  async function (input: AddQuoteShippingInput, { container }) {
    if (input.shipping_cost == null) {
      return new StepResponse(null);
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: options } = await query.graph({
      entity: "shipping_option",
      fields: ["id"],
      filters: { type: { code: "quote-shipping" } },
    });

    if (!options.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Quote shipping option not found. Run: npx medusa exec ./src/scripts/seed-quote-shipping.ts"
      );
    }

    const orderModule: IOrderModuleService = container.resolve(Modules.ORDER);

    const [shippingMethod] = await orderModule.createOrderShippingMethods([
      {
        order_id: input.order_id,
        shipping_option_id: options[0].id,
        name: "Portes Personalizados",
        amount: input.shipping_cost,
        is_tax_inclusive: true,
      },
    ]);

    return new StepResponse(shippingMethod.id);
  }
);
