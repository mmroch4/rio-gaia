import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const CollectionBreadcrumbItem = ({
  title,
  handle,
}: {
  title: string
  handle?: string
}) => {
  return (
    <li className="text-neutral-500">
      <LocalizedClientLink
        className="hover:text-neutral-900"
        href={handle ? `/portal/colecoes/${handle}` : "/portal/catalogo"}
      >
        {title}
      </LocalizedClientLink>
    </li>
  )
}

const CollectionBreadcrumb = ({
  collection,
}: {
  collection: HttpTypes.StoreCollection
}) => {
  return (
    <ul className="flex items-center gap-x-3 text-sm">
      <CollectionBreadcrumbItem title="Products" key="base" />
      <span className="text-neutral-500">{">"}</span>
      <CollectionBreadcrumbItem
        title={collection.title}
        handle={collection.handle}
        key={collection.id}
      />
    </ul>
  )
}

export default CollectionBreadcrumb
