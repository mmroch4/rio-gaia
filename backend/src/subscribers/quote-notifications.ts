import { RemoteQueryFunction } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";

export default async function quoteNotificationHandler({
  event,
  container,
}: SubscriberArgs<{ quote_id: string }>) {
  const logger = container.resolve("logger");

  try {
    const notificationService = container.resolve(Modules.NOTIFICATION);
    const query = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.QUERY,
    );
    const config = container.resolve("configModule");

    const { quote_id } = event.data;
    const eventName = event.name;

    // Fetch quote with customer + draft order details
    const {
      data: [quote],
    } = await query.graph({
      entity: "quote",
      fields: [
        "id",
        "status",
        "created_at",
        "*customer",
        "draft_order.id",
        "draft_order.display_id",
        "draft_order.currency_code",
        "draft_order.total",
        "draft_order.subtotal",
        "draft_order.tax_total",
        "draft_order.shipping_total",
        "*draft_order.items",
        "*draft_order.items.variant",
        "*draft_order.items.variant.product",
      ],
      filters: { id: quote_id },
    });

    if (!quote) {
      logger.warn(`Quote ${quote_id} not found for event ${eventName}`);
      return;
    }

    const storefrontUrl = config.admin.storefrontUrl || "http://localhost:8000";
    const customerEmail = quote.customer?.email;
    const adminEmail = process.env.SMTP_FROM;
    
    console.log("-------------------", quote)
    console.log("-------------------", adminEmail)

    const notifications: Array<{
      to: string;
      channel: string;
      template: string;
      data: Record<string, any>;
    }> = [];

    switch (eventName) {
      case "quote.requested":
        if (customerEmail) {
          notifications.push({
            to: customerEmail,
            channel: "email",
            template: "quote-requested",
            data: {
              quote,
              portal_url: `${storefrontUrl}/pt/portal/conta/orcamentos`,
            },
          });
        }
        if (adminEmail) {
          notifications.push({
            to: adminEmail,
            channel: "email",
            template: "quote-admin-notification",
            data: { quote, event_type: "requested" },
          });
        }
        break;

      case "quote.sent":
        if (customerEmail) {
          notifications.push({
            to: customerEmail,
            channel: "email",
            template: "quote-sent",
            data: {
              quote,
              portal_url: `${storefrontUrl}/pt/portal/conta/orcamentos`,
            },
          });
        }
        break;

      case "quote.accepted":
        if (customerEmail) {
          notifications.push({
            to: customerEmail,
            channel: "email",
            template: "quote-accepted",
            data: {
              quote,
              portal_url: `${storefrontUrl}/pt/portal/conta/encomendas`,
            },
          });
        }
        if (adminEmail) {
          notifications.push({
            to: adminEmail,
            channel: "email",
            template: "quote-admin-notification",
            data: { quote, event_type: "accepted" },
          });
        }
        break;

      case "quote.customer_rejected":
        if (adminEmail) {
          notifications.push({
            to: adminEmail,
            channel: "email",
            template: "quote-admin-notification",
            data: { quote, event_type: "customer_rejected" },
          });
        }
        break;

      case "quote.merchant_rejected":
        if (customerEmail) {
          notifications.push({
            to: customerEmail,
            channel: "email",
            template: "quote-rejected",
            data: {
              quote,
              portal_url: `${storefrontUrl}/pt/portal/conta/orcamentos`,
            },
          });
        }
        break;
    }

    for (const notification of notifications) {
      try {
        await notificationService.createNotifications(notification);
      } catch (error) {
        logger.error(
          `Failed to send quote email [${eventName}] to ${notification.to}: ${error.message}`,
        );
      }
    }
  } catch (error) {
    logger.error(
      `Quote notification subscriber failed [${event.name}]: ${error.message}`,
    );
  }
}

export const config: SubscriberConfig = {
  event: [
    "quote.requested",
    "quote.sent",
    "quote.accepted",
    "quote.customer_rejected",
    "quote.merchant_rejected",
  ],
};
