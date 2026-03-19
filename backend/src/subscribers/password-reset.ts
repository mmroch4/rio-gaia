import { Modules } from "@medusajs/framework/utils";
import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa";

export default async function resetPasswordTokenHandler({
  event: { data: {
    entity_id: email,
    token,
    actor_type,
  } },
  container,
}: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  );
  const config = container.resolve("configModule");
  const logger = container.resolve("logger");

  logger.info(`🔔 Password reset subscriber triggered for: ${email} (${actor_type})`);

  // Note: MedusaJS already verifies the user exists before emitting this event
  // so we don't need to verify again here

  let urlPrefix = "";

  if (actor_type === "customer") {
    urlPrefix = config.admin.storefrontUrl || "http://localhost:8000";
    urlPrefix += "/conta";
  } else {
    const backendUrl = config.admin.backendUrl !== "/" ? config.admin.backendUrl :
      "http://localhost:9000";
    const adminPath = config.admin.path;
    urlPrefix = `${backendUrl}${adminPath}`;
  }

  const resetUrl = `${urlPrefix}/redefinir-password?token=${token}&email=${email}`;
  logger.info(`Reset URL generated: ${resetUrl}`);

  try {
    await notificationModuleService.createNotifications({
      to: email,
      channel: "email",
      template: "password-reset",
      data: {
        reset_url: resetUrl,
      },
    });

    logger.info(`✓ Password reset email sent successfully to ${actor_type}: ${email}`);
  } catch (error) {
    logger.error(`✗ Failed to send password reset email: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);
    throw error;
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
};
