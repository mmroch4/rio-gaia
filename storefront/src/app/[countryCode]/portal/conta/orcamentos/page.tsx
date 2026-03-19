import { fetchQuotes } from "@/lib/data/quotes"
import QuotesOverview from "./components/quotes-overview"

export default async function Quotes() {
  const { quotes } = await fetchQuotes()

  return (
    <div className="w-full" data-testid="quotes-page-wrapper">
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold mb-2">Orçamentos</h1>
      </div>

      <div>
        <QuotesOverview quotes={quotes!} />
      </div>
    </div>
  )
}
