"use client"

import { signout } from "@/lib/data/customer"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ChevronDown from "@/modules/common/icons/chevron-down"
import FilePlus from "@/modules/common/icons/file-plus"
import MapPin from "@/modules/common/icons/map-pin"
import Package from "@/modules/common/icons/package"
import User from "@/modules/common/icons/user"
import { B2BCustomer } from "@/types/global"
import { ArrowRightOnRectangle, BuildingStorefront } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"

const AccountNav = ({
  customer,
}: {
  customer: B2BCustomer | null
}) => {
  const route = usePathname()

  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">

        <div className="text-xl-semi mb-4 px-8">
          Olá {customer?.first_name}
        </div>
        <div className="text-base-regular">
          <ul>
            <li>
              <LocalizedClientLink
                href="/portal/conta/perfil"
                className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                data-testid="profile-link"
              >
                <>
                  <div className="flex items-center gap-x-2">
                    <User size={20} />
                    <span>Perfil</span>
                  </div>
                  <ChevronDown className="transform -rotate-90" />
                </>
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/portal/conta/empresa"
                className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                data-testid="company-link"
              >
                <>
                  <div className="flex items-center gap-x-2">
                    <BuildingStorefront width={20} />
                    <span>Empresa</span>
                  </div>
                  <ChevronDown className="transform -rotate-90" />
                </>
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/portal/conta/moradas"
                className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                data-testid="addresses-link"
              >
                <>
                  <div className="flex items-center gap-x-2">
                    <MapPin size={20} />
                    <span>Moradas</span>
                  </div>
                  <ChevronDown className="transform -rotate-90" />
                </>
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/portal/conta/encomendas"
                className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                data-testid="orders-link"
              >
                <div className="flex items-center gap-x-2">
                  <Package size={20} />
                  <span>Encomendas</span>
                </div>
                <ChevronDown className="transform -rotate-90" />
              </LocalizedClientLink>
            </li>

            <li>
              <LocalizedClientLink
                href="/portal/conta/orcamentos"
                className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                data-testid="quotes-link"
              >
                <div className="flex items-center gap-x-2">
                  <FilePlus size={16} />
                  <span>Orçamentos</span>
                </div>
                <ChevronDown className="transform -rotate-90" />
              </LocalizedClientLink>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <div className="flex items-center gap-x-2">
                  <ArrowRightOnRectangle />
                  <span>Terminar Sessão</span>
                </div>
                <ChevronDown className="transform -rotate-90" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="hidden small:block" data-testid="account-nav">
        <div className="text-lg">
          <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
            <li>
              <AccountNavLink
                href="/portal/conta"
                route={route!}
                data-testid="overview-link"
              >
                Visão Geral
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/portal/conta/perfil"
                route={route!}
                data-testid="profile-link"
              >
                Perfil
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/portal/conta/empresa"
                route={route!}
                data-testid="company-link"
              >
                Empresa
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/portal/conta/moradas"
                route={route!}
                data-testid="addresses-link"
              >
                Moradas
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/portal/conta/encomendas"
                route={route!}
                data-testid="orders-link"
              >
                Encomendas
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/portal/conta/orcamentos"
                route={route!}
                data-testid="quotes-link"
              >
                Orçamentos
              </AccountNavLink>
            </li>
            <li className="text-neutral-400 hover:text-neutral-950">
              <button
                type="button"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                Terminar Sessão
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "text-neutral-400 hover:text-neutral-950 flex items-center gap-x-2",
        {
          "text-neutral-950": active,
        }
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
