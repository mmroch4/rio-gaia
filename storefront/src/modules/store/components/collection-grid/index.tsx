import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import PlaceholderImage from "@/modules/common/icons/placeholder-image"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

export default function CollectionGrid({
  collections,
}: {
  collections: HttpTypes.StoreCollection[]
}) {
  return (
    <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4">
      {collections.map((collection) => (
        <li key={collection.id}>
          <CollectionCard collection={collection} />
        </li>
      ))}
    </ul>
  )
}

function CollectionCard({
  collection,
}: {
  collection: HttpTypes.StoreCollection
}) {
  const image =
    (collection.metadata?.image as string) ||
    collection.products?.[0]?.thumbnail ||
    null

  return (
    <LocalizedClientLink
      href={`/portal/colecoes/${collection.handle}`}
      className="group"
    >
      <div className="flex flex-col bg-white rounded-lg shadow-borders-base overflow-hidden group-hover:shadow-[0_0_0_4px_rgba(0,0,0,0.1)] transition-shadow duration-150">
        <div className="relative aspect-square bg-neutral-100">
          {image ? (
            <Image
              src={image}
              alt={collection.title}
              fill
              className="object-cover"
              sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlaceholderImage size={24} />
            </div>
          )}
        </div>

        <div className="p-4 text-center">
          <span className="text-sm font-medium text-gray-900">
            {collection.title}
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
