type RealtimeCallback = (data: any) => void

export class RealtimeService {
  private static subscribers: Map<string, Set<RealtimeCallback>> = new Map()
  private static pollingIntervals: Map<string, NodeJS.Timeout> = new Map()

  static subscribe(channel: string, callback: RealtimeCallback) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set())
      this.startPolling(channel)
    }

    this.subscribers.get(channel)!.add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(channel)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.stopPolling(channel)
          this.subscribers.delete(channel)
        }
      }
    }
  }

  private static startPolling(channel: string) {
    // Poll every 5 seconds for updates
    const interval = setInterval(async () => {
      try {
        const data = await this.fetchChannelData(channel)
        this.broadcast(channel, data)
      } catch (error) {
        console.error(`[v0] Realtime polling error for ${channel}:`, error)
      }
    }, 5000)

    this.pollingIntervals.set(channel, interval)
  }

  private static stopPolling(channel: string) {
    const interval = this.pollingIntervals.get(channel)
    if (interval) {
      clearInterval(interval)
      this.pollingIntervals.delete(channel)
    }
  }

  private static async fetchChannelData(channel: string) {
    // Map channels to API endpoints
    const endpoints: Record<string, string> = {
      notifications: "/api/notifications?userId=current-user",
      leaderboard: "/api/students?cohortId=current-cohort",
      projects: "/api/projects",
      discussions: "/api/discussions",
    }

    const endpoint = endpoints[channel]
    if (!endpoint) return null

    const response = await fetch(endpoint)
    const result = await response.json()
    return result.data
  }

  private static broadcast(channel: string, data: any) {
    const callbacks = this.subscribers.get(channel)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  static emit(channel: string, data: any) {
    this.broadcast(channel, data)
  }
}
