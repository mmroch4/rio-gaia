import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { StoreContactFormType } from "./validators";

export const POST = async (
  req: MedusaRequest<StoreContactFormType>,
  res: MedusaResponse
) => {
  const notificationService = req.scope.resolve(Modules.NOTIFICATION);
  const { name, email, phone, message } = req.validatedBody;

  const adminEmail = process.env.SMTP_FROM;

  // Send notification to Rio Gaia team
  if (adminEmail) {
    await notificationService.createNotifications({
      to: adminEmail,
      channel: "email",
      template: "contact-form-notification",
      data: { name, email, phone, message },
    });
  }

  // Send confirmation to the sender
  await notificationService.createNotifications({
    to: email,
    channel: "email",
    template: "contact-form-confirmation",
    data: { name },
  });

  res.status(200).json({ success: true });
};
