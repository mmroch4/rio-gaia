"use client"

import { searchClient } from "@/lib/config"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Modal from "@/modules/common/components/modal"
import { MagnifyingGlassMini } from "@medusajs/icons"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"

type HitProduct = {
  id: string
  title: string
  description: string
  handle: string
  thumbnail: string
  categories: {
    id: string
    name: string
    handle: string
  }[]
  tags: {
    id: string
    value: string
  }[]
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close modal on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-100 text-zinc-900 px-4 py-2 rounded-full shadow-borders-base hover:bg-gray-200 transition-colors"
        aria-label="Pesquisar produtos"
      >
        <MagnifyingGlassMini className="w-4 h-4" />
        <span className="hidden small:inline">Pesquisar produtos</span>
      </button>

      <Modal isOpen={isOpen} close={() => setIsOpen(false)} search size="large">
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || "products"}
        >
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <SearchBox
              placeholder="Pesquisar produtos..."
              classNames={{
                root: "w-full",
                form: "relative",
                input:
                  "w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent text-base",
                submit: "absolute left-3 top-1/2 -translate-y-1/2",
                submitIcon: "w-4 h-4 text-gray-400",
                reset: "absolute right-3 top-1/2 -translate-y-1/2",
                resetIcon: "w-4 h-4 text-gray-400",
              }}
            />
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <Hits hitComponent={({ hit }: { hit: HitProduct }) => <Hit key={"pesquisa_" + hit.id} hit={hit} />} />
            </div>
          </div>
        </InstantSearch>
      </Modal>
    </>
  )
}

const Hit = ({ hit }: { hit: HitProduct }) => {
  return (
    <LocalizedClientLink
      href={`/portal/produtos/${hit.handle}`}
      className="flex flex-row gap-x-4 p-3 rounded-lg hover:bg-[#0047AB]/5 transition-colors border border-transparent hover:border-[#0047AB]/10"
    >
      {hit.thumbnail ? (
        <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
          <Image
            src={hit.thumbnail}
            alt={hit.title}
            width={64}
            height={64}
            className="rounded-md object-contain max-w-16 max-h-16"
          />
        </div>
      ) : (
        <div className="w-16 h-16 aspect-square bg-[#0047AB]/10 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-[#0047AB]/60 text-xs">Sem imagem</span>
        </div>
      )}
      <div className="flex flex-col gap-y-1 justify-center">
        <h3 className="font-medium text-zinc-900">{hit.title}</h3>
        {hit.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{hit.description}</p>
        )}
      </div>
    </LocalizedClientLink>
  )
}
