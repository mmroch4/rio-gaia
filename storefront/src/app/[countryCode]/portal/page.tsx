import { listCategories } from "@/lib/data/categories"
import { listCollections } from "@/lib/data/collections"
import CategoryGrid from "@/modules/store/components/category-grid"
import CollectionGrid from "@/modules/store/components/collection-grid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal",
  description: "Explore as nossas categorias de produtos cerâmicos.",
}

export default async function PortalPage() {
  const [categories, { collections }] = await Promise.all([
    listCategories(),
    listCollections(),
  ])

  const topLevelCategories = categories.filter(
    (cat) => cat.parent_category_id === null
  )

  return (
    <div className="bg-neutral-100">
      <div className="content-container py-8 flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Categorias
          </h1>
          <CategoryGrid categories={topLevelCategories} />
        </div>
        {collections.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Coleções
            </h2>
            <CollectionGrid collections={collections} />
          </div>
        )}
      </div>
    </div>
  )
}