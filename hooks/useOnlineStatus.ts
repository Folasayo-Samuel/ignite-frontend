"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '@/components/providers/socket-provider'

interface OnlineStatusStore {
  [userId: string]: boolean
}

export function useOnlineStatus(userIds: string[] = []) {
  const { socket, isConnected } = useSocket()
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatusStore>({})

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleOnline = (payload: { userId: string; timestamp: number }) => {
      setOnlineStatus(prev => ({ ...prev, [payload.userId]: true }))
    }

    const handleOffline = (payload: { userId: string; timestamp: number }) => {
      setOnlineStatus(prev => ({ ...prev, [payload.userId]: false }))
    }

    socket.on('presence.online', handleOnline)
    socket.on('presence.offline', handleOffline)

    return () => {
      socket.off('presence.online', handleOnline)
      socket.off('presence.offline', handleOffline)
    }
  }, [socket, isConnected])

  const isOnline = useCallback((userId: string) => {
    return onlineStatus[userId] || false
  }, [onlineStatus])

  return { onlineStatus, isOnline }
}
