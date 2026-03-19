"use client"

import { useCart } from "@/lib/context/cart-context"
import { createQuote } from "@/lib/data/quotes"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { XCircle } from "@medusajs/icons"
import { Button, toast } from "@medusajs/ui"
import * as Dialog from "@radix-ui/react-dialog"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export const RequestQuoteConfirmation = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [requesting, setRequesting] = useState(false)
  const [open, setOpen] = useState(false)
  const { countryCode } = useParams()
  const router = useRouter()

  const { cart } = useCart()

  const isCartEmpty = !cart?.items || cart?.items.length === 0

  const handleCreateQuoteRequest = async () => {
    if (isCartEmpty) {
      toast.error("Carrinho vazio", { description: "Não é possível criar um pedido de orçamento com o carrinho vazio." })
      return
    }

    setRequesting(true)

    try {
      const { quote } = await createQuote()

      router.push(`/${countryCode}/portal/conta/orcamentos/detalhes/${quote.id}`)
    } catch (error) {
      setRequesting(false)

      toast.error("Falha ao criar pedido de orçamento")
    }

    setOpen(false)
    setRequesting(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-[75]" />

        <Dialog.Content className="z-[100] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-lg mb-6 flex justify-between">
            {isCartEmpty ? "Carrinho vazio" : "Submeter pedido de orçamento"}

            <Dialog.Close asChild>
              <XCircle className="text-violet11 hover:bg-violet4 focus:shadow-violet7 inline-flex appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] outline-none cursor-pointer" />
            </Dialog.Close>
          </Dialog.Title>

          {isCartEmpty ? (
            <>
              <div className="flex flex-col gap-y-4">
                <p>
                  Não é possível criar um pedido de orçamento com o carrinho vazio.
                </p>
              </div>

              <div className="mt-[25px] flex justify-end gap-x-2">
                <Dialog.Close asChild>
                  <LocalizedClientLink href="/portal/catalogo">
                    <Button>
                      Explorar Catálogo
                    </Button>
                  </LocalizedClientLink>
                </Dialog.Close>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-y-4">
                <p>
                  Está prestes a pedir um orçamento para o carrinho. Se confirmar, o
                  carrinho será convertido num orçamento.
                </p>
              </div>

              <div className="mt-[25px] flex justify-end gap-x-2">
                <Dialog.Close asChild>
                  <Button variant="secondary" disabled={requesting}>
                    Cancelar
                  </Button>
                </Dialog.Close>

                <Button onClick={handleCreateQuoteRequest} isLoading={requesting}>
                  Submeter
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
