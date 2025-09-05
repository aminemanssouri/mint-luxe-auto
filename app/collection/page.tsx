import CollectionClient, { type Vehicle } from "@/components/collection-client"
import { headers } from "next/headers"
import type { Metadata } from "next"

// Remote vehicle type compatible with current UI
type SearchParams = { [key: string]: string | string[] | undefined }

// All options and data are sourced from backend now

export const metadata: Metadata = {
  title: "Collection",
}

export default async function CollectionPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams
  const type = (resolvedSearchParams.type as string) || "all"
  const brand = (resolvedSearchParams.brand as string) || "all"
  const category = (resolvedSearchParams.category as string) || "all"
  const location = (resolvedSearchParams.location as string) || "all"
  const year = (resolvedSearchParams.year as string) || "all"
  const search = (resolvedSearchParams.search as string) || ""
  const sort = (resolvedSearchParams.sort as string) || "featured"
  const price = (resolvedSearchParams.price as string) || "all"
  const page = Number(resolvedSearchParams.page ?? 1) || 1
  const pageSize = Number(resolvedSearchParams.pageSize ?? 12) || 12

  const params = new URLSearchParams()
  if (type !== "all") params.set("type", type)
  if (brand !== "all") params.set("brand", brand)
  if (category !== "all") params.set("category", category)
  if (location !== "all") params.set("location", location)
  if (year !== "all") params.set("year", year)
  if (search) params.set("search", search)
  if (sort) params.set("sort", sort)
  if (price !== "all") {
    if (price.includes("-")) {
      const [min, max] = price.split("-").map(Number)
      if (!Number.isNaN(min)) params.set("priceMin", String(min))
      if (!Number.isNaN(max)) params.set("priceMax", String(max))
    }
  }
  params.set("limit", String(pageSize))
  params.set("offset", String((page - 1) * pageSize))

  const qs = params.toString()
  // Build absolute URL for SSR fetch
  const h = await headers()
  const proto = h.get("x-forwarded-proto") || "http"
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
  const res = await fetch(`${baseUrl}/api/vehicles${qs ? `?${qs}` : ""}`, {
    // Cache on the server for 30s to improve first load
    next: { revalidate: 30 },
  })

  let initialItems: Vehicle[] = []
  let initialTotal: number | null = null
  if (res.ok) {
    const json = await res.json()
    if (json?.ok && Array.isArray(json.items)) {
      initialItems = json.items
      initialTotal = typeof json.totalCount === "number" ? json.totalCount : null
    }
  }

  const initialParams = { type, brand, category, location, year, search, sort, price, page, pageSize }

  return (
    <CollectionClient initialItems={initialItems} initialTotal={initialTotal} initialParams={initialParams} />
  )
}
