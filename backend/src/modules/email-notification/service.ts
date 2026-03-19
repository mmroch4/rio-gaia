import { Logger } from "@medusajs/framework/types";
import {
  AbstractNotificationProviderService
} from "@medusajs/framework/utils";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import PasswordResetEmail from "./templates/password-reset";

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
      this.logger_.info(`SMTP Config: ${this.options_.smtp_host}:${this.options_.smtp_port}`);

      // Render template based on template name
      switch (notification.template) {
        case "password-reset":
          html = await render(
            PasswordResetEmail({
              resetUrl: notification.data.reset_url,
              email: notification.to,
            })
          );
          subject = "Reset your password";
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

      this.logger_.info(`✓ Email sent successfully!`);
      this.logger_.info(`  Message ID: ${info.messageId}`);
      this.logger_.info(`  From: ${this.options_.smtp_from}`);
      this.logger_.info(`  To: ${notification.to}`);

      // If using Ethereal, show preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger_.info(`  📧 Preview URL: ${previewUrl}`);
        this.logger_.info(`  ⚠️  Using Ethereal (test SMTP) - emails won't reach real inboxes!`);
      }

      return { id: info.messageId };
    } catch (error) {
      this.logger_.error(`✗ Failed to send email to ${notification.to}`);
      this.logger_.error(`  Error: ${error.message}`);
      this.logger_.error(`  SMTP: ${this.options_.smtp_host}:${this.options_.smtp_port}`);
      throw error;
    }
  }
}

export default EmailNotificationProviderService;
