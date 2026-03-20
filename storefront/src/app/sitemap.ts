import type { MetadataRoute } from "next"
import { getBaseURL } from "@/lib/util/env"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseURL()

  const pages = [
    { path: "/pt", changeFrequency: "monthly" as const, priority: 1.0 },
    { path: "/pt/sobre", changeFrequency: "monthly" as const, priority: 0.8 },
    {
      path: "/pt/contacto",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/pt/casos-de-sucesso",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      path: "/pt/casos-de-sucesso/hotel-quinta-regaleira",
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      path: "/pt/casos-de-sucesso/museu-nacional-azulejo",
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      path: "/pt/casos-de-sucesso/algarve-gift-shops",
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      path: "/pt/produtos",
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      path: "/pt/produtos/imanes-ceramicos",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/pt/produtos/porta-copos",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/pt/produtos/azulejos-decorativos",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/pt/politica-privacidade",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      path: "/pt/termos-e-condicoes",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
