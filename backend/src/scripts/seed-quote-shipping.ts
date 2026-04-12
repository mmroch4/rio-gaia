import { createShippingOptionsWorkflow } from "@medusajs/core-flows";
import {
  ExecArgs,
  IFulfillmentModuleService,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

/**
 * Creates the "Portes Personalizados" shipping option for quote shipping costs.
 * Run once on existing databases: npx medusa exec ./src/scripts/seed-quote-shipping.ts
 */
export default async function seedQuoteShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModule: IFulfillmentModuleService = container.resolve(
    Modules.FULFILLMENT
  );

  // Check if already exists
  const { data: existing } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
    filters: { type: { code: "quote-shipping" } },
  });

  if (existing.length > 0) {
    logger.info("Quote shipping option already exists. Skipping.");
    return;
  }

  // Find existing fulfillment set and shipping profile
  const fulfillmentSets = await fulfillmentModule.listFulfillmentSets({}, {
    relations: ["service_zones"],
  });

  if (!fulfillmentSets.length || !fulfillmentSets[0].service_zones?.length) {
    throw new Error(
      "No fulfillment set with service zones found. Run the main seed script first."
    );
  }

  const serviceZoneId = fulfillmentSets[0].service_zones[0].id;

  const shippingProfiles = await fulfillmentModule.listShippingProfiles({});
  if (!shippingProfiles.length) {
    throw new Error(
      "No shipping profile found. Run the main seed script first."
    );
  }
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id"],
    filters: { countries: { iso_2: "pt" } },
  });

  const prices = [
    { currency_code: "eur", amount: 0 },
    ...(regions.length > 0
      ? [{ region_id: regions[0].id, amount: 0 }]
      : []),
  ] as any;

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Portes Personalizados",
        price_type: "flat" as const,
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfiles[0].id,
        type: {
          label: "Portes Personalizados",
          description: "Custom shipping for quotes.",
          code: "quote-shipping",
        },
        prices,
        rules: [
          {
            attribute: "enabled_in_store",
            value: '"false"',
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });

  logger.info("Quote shipping option 'Portes Personalizados' created successfully.");
}
