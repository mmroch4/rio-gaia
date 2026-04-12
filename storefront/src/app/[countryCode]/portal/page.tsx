import { listCategories } from "@/lib/data/categories"
import CategoryGrid from "@/modules/store/components/category-grid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal",
  description: "Explore as nossas categorias de produtos cerâmicos.",
}

export default async function PortalPage() {
  const categories = await listCategories()

  const topLevelCategories = categories.filter(
    (cat) => cat.parent_category_id === null
  )

  return (
    <div className="bg-neutral-100">
      <div className="content-container py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Categorias
        </h1>
        <CategoryGrid categories={topLevelCategories} />
      </div>
    </div>
  )
}