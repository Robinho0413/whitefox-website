"use client"

import { useEffect, useMemo, useState } from "react"

type RangeKey = "24h" | "7d" | "30d"

type UmamiStats = {
  range: RangeKey
  visitors: number
  pageviews: number
  visits: number
  previousVisitors: number
  previousPageviews: number
  previousVisits: number
}

const RANGE_LABEL: Record<RangeKey, string> = {
  "24h": "24h",
  "7d": "7 jours",
  "30d": "30 jours",
}

function formatDeltaPercent(current: number, previous: number) {
  if (previous <= 0) {
    return current > 0 ? "+100%" : "0%"
  }

  const delta = ((current - previous) / previous) * 100
  const rounded = Math.abs(delta).toFixed(1)
  return `${delta >= 0 ? "+" : "-"}${rounded}%`
}

function DeltaLine({ current, previous }: { current: number; previous: number }) {
  const delta = formatDeltaPercent(current, previous)
  const isPositive = delta.startsWith("+") && delta !== "+0.0%"
  const isNegative = delta.startsWith("-")

  return (
    <p className={`text-xs ${isPositive ? "text-primary-500" : isNegative ? "text-amber-500" : "text-muted-foreground"}`}>
      {delta} / période précédente
    </p>
  )
}

export default function UmamiStatsCard() {
  const [range, setRange] = useState<RangeKey>("24h")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsByRange, setStatsByRange] = useState<Partial<Record<RangeKey, UmamiStats>>>({})

  useEffect(() => {
    const controller = new AbortController()

    const fetchStats = async () => {
      if (statsByRange[range]) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/umami-stats?range=${range}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Impossible de charger les statistiques")
        }

        const payload = (await response.json()) as UmamiStats

        setStatsByRange((prev) => ({
          ...prev,
          [range]: payload,
        }))
      } catch {
        if (!controller.signal.aborted) {
          setError("Impossible de charger les statistiques.")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void fetchStats()

    return () => {
      controller.abort()
    }
  }, [range, statsByRange])

  const currentStats = useMemo(() => statsByRange[range], [range, statsByRange])

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-md border bg-secondary/40 p-1">
        {(["24h", "7d", "30d"] as RangeKey[]).map((value) => {
          const isActive = range === value

          return (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={`w-20 rounded px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {RANGE_LABEL[value]}
            </button>
          )
        })}
      </div>

      {loading && !currentStats ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="rounded-md border bg-secondary/20 p-3 animate-pulse">
              <div className="h-3 w-20 rounded bg-secondary/70" />
              <div className="mt-2 h-8 w-16 rounded bg-secondary/70" />
              <div className="mt-2 h-3 w-32 rounded bg-secondary/70" />
            </div>
          ))}
        </div>
      ) : error && !currentStats ? (
        <p className="text-sm text-muted-foreground">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border bg-secondary/20 p-3">
              <p className="text-xs text-muted-foreground">Visiteurs</p>
              <p className="text-2xl font-semibold">{currentStats?.visitors.toLocaleString("fr-FR") ?? 0}</p>
              <DeltaLine
                current={currentStats?.visitors ?? 0}
                previous={currentStats?.previousVisitors ?? 0}
              />
            </div>

            <div className="rounded-md border bg-secondary/20 p-3">
              <p className="text-xs text-muted-foreground">Pages vues</p>
              <p className="text-2xl font-semibold">{currentStats?.pageviews.toLocaleString("fr-FR") ?? 0}</p>
              <DeltaLine
                current={currentStats?.pageviews ?? 0}
                previous={currentStats?.previousPageviews ?? 0}
              />
            </div>

            <div className="rounded-md border bg-secondary/20 p-3">
              <p className="text-xs text-muted-foreground">Visites</p>
              <p className="text-2xl font-semibold">{currentStats?.visits.toLocaleString("fr-FR") ?? 0}</p>
              <DeltaLine
                current={currentStats?.visits ?? 0}
                previous={currentStats?.previousVisits ?? 0}
              />
            </div>
          </div>
        </>
      )}

      {loading && currentStats ? (
        <p className="text-xs text-muted-foreground">Mise a jour...</p>
      ) : null}
    </div>
  )
}
