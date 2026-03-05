import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RangeKey = "24h" | "7d" | "30d"

const RANGE_IN_MS: Record<RangeKey, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value
  if (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    typeof (value as { value: unknown }).value === "number"
  ) {
    return (value as { value: number }).value
  }

  return 0
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const rangeParam = req.nextUrl.searchParams.get("range")
  const range: RangeKey =
    rangeParam === "7d" || rangeParam === "30d" || rangeParam === "24h"
      ? rangeParam
      : "24h"

  const umamiApiUrl = process.env.UMAMI_API_URL
  const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID
  const umamiApiKey = process.env.UMAMI_API_KEY

  if (!umamiApiUrl || !umamiWebsiteId || !umamiApiKey) {
    return NextResponse.json({ error: "Missing Umami environment variables" }, { status: 500 })
  }

  const endAt = Date.now()
  const startAt = endAt - RANGE_IN_MS[range]

  const response = await fetch(
    `${umamiApiUrl}/websites/${umamiWebsiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
    {
      headers: {
        Authorization: `Bearer ${umamiApiKey}`,
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    return NextResponse.json(
      { error: "Umami request failed", details: errorText },
      { status: 502 }
    )
  }

  const rawStats = await response.json()

  return NextResponse.json({
    range,
    visitors: toNumber(rawStats?.visitors),
    pageviews: toNumber(rawStats?.pageviews),
    visits: toNumber(rawStats?.visits),
    previousVisitors: toNumber(rawStats?.comparison?.visitors),
    previousPageviews: toNumber(rawStats?.comparison?.pageviews),
    previousVisits: toNumber(rawStats?.comparison?.visits),
  })
}
