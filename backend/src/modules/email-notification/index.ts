import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import EmailNotificationProviderService from "./service";

export const EMAIL_NOTIFICATION_MODULE = "email-notification";

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [EmailNotificationProviderService],
});
