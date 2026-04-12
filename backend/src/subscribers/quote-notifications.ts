import { Modules } from "@medusajs/framework/utils";
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";

interface QuoteEventPayload {
  quote_id: string;
  quote: {
    id: string;
    shipping_cost?: number | null;
    customer?: {
      first_name?: string;
      last_name?: string;
      email?: string;
    };
    draft_order?: {
      id?: string;
      display_id?: number;
      currency_code?: string;
      total?: number;
      subtotal?: number;
      tax_total?: number;
      shipping_total?: number;
      items?: Array<{
        quantity: number;
        unit_price: number;
        variant?: { product?: { title?: string } };
      }>;
    };
  };
  customer_email?: string;
  message?: {
    text?: string;
    admin_id?: string;
    customer_id?: string;
  };
  sender_role?: "admin" | "customer";
}

export default async function quoteNotificationHandler({
  event,
  container,
}: SubscriberArgs<QuoteEventPayload>) {
  const logger = container.resolve("logger");

  try {
    const notificationService = container.resolve(Modules.NOTIFICATION);
    const config = container.resolve("configModule");

    const { quote, customer_email } = event.data;
    const eventName = event.name;

    if (!quote) {
      logger.warn(`No quote data in event payload for ${eventName}`);
      return;
    }

    const storefrontUrl = config.admin.storefrontUrl || "http://localhost:8000";
    const customerEmail = customer_email || quote.customer?.email;
    const adminEmail = process.env.SMTP_FROM;

    logger.info(
      `Sending quote notification: ${eventName} - Customer: ${customerEmail}`,
    );

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

      case "quote.message_created": {
        const { message, sender_role } = event.data;
        const quoteDetailUrl = `${storefrontUrl}/pt/portal/conta/orcamentos/detalhes/${quote.id}`;

        if (sender_role === "customer" && adminEmail) {
          const senderName = [
            quote.customer?.first_name,
            quote.customer?.last_name,
          ]
            .filter(Boolean)
            .join(" ") || "Cliente";

          notifications.push({
            to: adminEmail,
            channel: "email",
            template: "quote-message-notification",
            data: {
              quote,
              message_text: message?.text || "",
              sender_name: senderName,
              portal_url: quoteDetailUrl,
            },
          });
        }

        if (sender_role === "admin" && customerEmail) {
          notifications.push({
            to: customerEmail,
            channel: "email",
            template: "quote-message-notification",
            data: {
              quote,
              message_text: message?.text || "",
              sender_name: "A equipa Rio Gaia",
              portal_url: quoteDetailUrl,
            },
          });
        }
        break;
      }
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
    "quote.message_created",
  ],
};
