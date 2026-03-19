import { listRegions } from "@/lib/data/regions"
import { CaseStudies } from "@/modules/home/components/CaseStudies"
import { CTASection } from "@/modules/home/components/CTASection"
import { CustomizationSection } from "@/modules/home/components/CustomizationSection"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Hero } from "@/modules/home/components/Hero"
import { TechnicalSpecs } from "@/modules/home/components/TechnicalSpecs"
import { TrustIndicators } from "@/modules/home/components/TrustIndicators"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Rio Gaia",
  description: "Rio Gaia",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )
  return countryCodes.map((countryCode) => ({ countryCode }))
}

export default async function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <TrustIndicators />
      <TechnicalSpecs />
      <CustomizationSection />
      <CaseStudies />
      <CTASection />
      <Footer />
    </div>
  )
}
