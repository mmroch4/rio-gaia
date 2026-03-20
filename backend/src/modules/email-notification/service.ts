import { Logger } from "@medusajs/framework/types";
import {
  AbstractNotificationProviderService
} from "@medusajs/framework/utils";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import PasswordResetEmail from "./templates/password-reset";
import QuoteAcceptedEmail from "./templates/quote-accepted";
import QuoteAdminNotificationEmail from "./templates/quote-admin-notification";
import QuoteRejectedEmail from "./templates/quote-rejected";
import QuoteRequestedEmail from "./templates/quote-requested";
import QuoteSentEmail from "./templates/quote-sent";

type InjectedDependencies = {
  logger: Logger;
};

interface EmailNotificationProviderOptions {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
}

export class EmailNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "email-notification";
  protected logger_: Logger;
  protected transporter_: nodemailer.Transporter;
  protected options_: EmailNotificationProviderOptions;

  constructor(
    { logger }: InjectedDependencies,
    options: EmailNotificationProviderOptions
  ) {
    super();
    this.logger_ = logger;
    this.options_ = options;

    // Create SMTP transporter
    // The 'secure' option determines the encryption method:
    // - Port 465: Uses implicit TLS/SSL (secure: true) - connection is encrypted from the start
    // - Port 587/2525: Uses STARTTLS (secure: false) - connection starts unencrypted then upgrades to TLS
    // This automatic detection allows flexibility with different SMTP providers
    this.transporter_ = nodemailer.createTransport({
      host: options.smtp_host,
      port: options.smtp_port,
      secure: options.smtp_port === 465,
      auth: {
        user: options.smtp_user,
        pass: options.smtp_pass,
      },
    });
  }

  private getAdminQuoteSubject(eventType: string): string {
    switch (eventType) {
      case "requested":
        return "Novo pedido de orçamento";
      case "accepted":
        return "Orçamento aceite pelo cliente";
      case "customer_rejected":
        return "Orçamento recusado pelo cliente";
      default:
        return "Atualização de orçamento";
    }
  }

  async send(notification: {
    to: string;
    channel: string;
    template: string;
    data: Record<string, any>;
  }): Promise<{ id: string }> {
    if (notification.channel !== "email") {
      this.logger_.warn(
        `Channel ${notification.channel} is not supported by email notification provider`
      );
      return { id: "unsupported-channel" };
    }

    try {
      let html: string;
      let subject: string;

      this.logger_.info(`Preparing to send email to: ${notification.to}`);

      // Render template based on template name
      switch (notification.template) {
        case "password-reset":
          html = await render(
            PasswordResetEmail({
              resetUrl: notification.data.reset_url,
              email: notification.to,
            })
          );
          subject = "Redefinir a sua palavra-passe";
          break;

        case "quote-requested":
          html = await render(QuoteRequestedEmail(notification.data));
          subject = "Pedido de orçamento recebido";
          break;

        case "quote-sent":
          html = await render(QuoteSentEmail(notification.data));
          subject = "O seu orçamento está pronto para revisão";
          break;

        case "quote-accepted":
          html = await render(QuoteAcceptedEmail(notification.data));
          subject = "Orçamento aceite — encomenda criada";
          break;

        case "quote-rejected":
          html = await render(QuoteRejectedEmail(notification.data));
          subject = "Atualização do seu pedido de orçamento";
          break;

        case "quote-admin-notification":
          html = await render(
            QuoteAdminNotificationEmail(notification.data)
          );
          subject = this.getAdminQuoteSubject(notification.data.event_type);
          break;

        default:
          this.logger_.warn(
            `Template ${notification.template} is not supported`
          );
          return { id: "unsupported-template" };
      }

      // Send email
      const info = await this.transporter_.sendMail({
        from: this.options_.smtp_from,
        to: notification.to,
        subject,
        html,
      });

      this.logger_.info(
        `Email sent to ${notification.to} [${info.messageId}]`
      );

      // If using Ethereal, show preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger_.info(`Ethereal preview: ${previewUrl}`);
      }

      return { id: info.messageId };
    } catch (error) {
      this.logger_.error(
        `Failed to send email to ${notification.to}: ${error.message}`
      );
      throw error;
    }
  }
}

export default EmailNotificationProviderService;
