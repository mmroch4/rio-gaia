import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Radio from "@/modules/common/components/radio"
import { HttpTypes } from "@medusajs/types"
import { Container, Text } from "@medusajs/ui"
import { usePathname, useSearchParams } from "next/navigation"

const CollectionList = ({
  collections,
}: {
  collections: HttpTypes.StoreCollection[]
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isCurrentCollection = (handle: string) =>
    pathname.split("/").slice(2).join("/") === `portal/colecoes/${handle}`

  return (
    <Container className="flex flex-col p-0 divide-y divide-neutral-200">
      <div className="flex justify-between items-center p-3">
        <Text className="text-sm font-medium">Coleções</Text>
        {pathname.includes("/portal/colecoes") && (
          <LocalizedClientLink
            href="/portal/catalogo"
            className="text-xs text-neutral-500 hover:text-neutral-700"
          >
            Limpar
          </LocalizedClientLink>
        )}
      </div>
      <ul className="flex flex-col gap-3 text-sm p-3 text-neutral-500">
        {collections.map((collection) => (
          <li key={collection.id}>
            <LocalizedClientLink
              href={`/portal/colecoes/${collection.handle}${
                searchParams.size ? `?${searchParams.toString()}` : ""
              }`}
              className="flex gap-2 items-center hover:text-neutral-700 text-start hover:cursor-pointer"
            >
              <Radio checked={isCurrentCollection(collection.handle!)} />
              {collection.title}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default CollectionList
