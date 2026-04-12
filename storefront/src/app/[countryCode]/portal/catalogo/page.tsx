import { listCategories } from "@/lib/data/categories"
import { listCollections } from "@/lib/data/collections"
import { retrieveCustomer } from "@/lib/data/customer"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import StoreBreadcrumb from "@/modules/store/components/store-breadcrumb"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { Metadata } from "next"
import { Suspense } from "react"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explore todos os nossos produtos cerâmicos personalizáveis.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const sort = sortBy || "created_at"
  const pageNumber = page ? parseInt(page) : 1

  const [categories, { collections }, customer] = await Promise.all([
    listCategories(),
    listCollections(),
    retrieveCustomer(),
  ])

  return (
    <div className="bg-neutral-100">
      <div
        className="flex flex-col py-6 content-container gap-4"
        data-testid="category-container"
      >
        <StoreBreadcrumb />

        <div className="flex flex-col small:flex-row small:items-start gap-3">
          <RefinementList sortBy={sort} categories={categories} collections={collections} />

          <div className="w-full">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={params.countryCode}
                customer={customer}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
;``
