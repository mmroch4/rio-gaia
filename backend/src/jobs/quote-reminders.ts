import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function quoteRemindersJob(
  container: MedusaContainer
) {
  const query = container.resolve(
    ContainerRegistrationKeys.QUERY
  )
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")
  const config = container.resolve("configModule")

  const fiveDaysAgo = new Date()
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)

  // Find quotes pending customer response for more than 5 days
  const { data: quotes } = await query.graph({
    entity: "quote",
    fields: [
      "id",
      "status",
      "updated_at",
      "*customer",
    ],
    filters: {
      status: "pending_customer",
      updated_at: { $lt: fiveDaysAgo.toISOString() },
    },
  })

  if (!quotes?.length) {
    return
  }

  const storefrontUrl =
    config.admin.storefrontUrl || "http://localhost:8000"

  logger.info(`Sending quote reminders for ${quotes.length} pending quotes`)

  for (const quote of quotes) {
    const email = quote.customer?.email
    if (!email) continue

    try {
      await notificationService.createNotifications({
        to: email,
        channel: "email",
        template: "quote-requested",
        data: {
          quote,
          portal_url: `${storefrontUrl}/pt/portal/conta/orcamentos`,
        },
      })
    } catch (error) {
      logger.error(
        `Failed to send quote reminder for ${quote.id}: ${error.message}`
      )
    }
  }
}

export const config = {
  name: "quote-reminders",
  schedule: "0 9 * * *",
}
