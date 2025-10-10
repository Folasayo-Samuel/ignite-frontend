"use client"

import { useEffect, useState } from "react"
import { RealtimeService } from "@/lib/services/realtime.service"

export function useRealtime<T>(channel: string, initialData: T) {
  const [data, setData] = useState<T>(initialData)

  useEffect(() => {
    const unsubscribe = RealtimeService.subscribe(channel, (newData) => {
      setData(newData)
    })

    return unsubscribe
  }, [channel])

  return data
}
