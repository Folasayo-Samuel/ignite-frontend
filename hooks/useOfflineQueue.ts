"use client"

import { useState, useEffect, useCallback } from 'react'

interface QueuedMessage {
  id: string
  body: string
  partnerId: string
  role: 'student' | 'mentor'
  createdAt: string
  retryCount: number
}

const STORAGE_KEY = 'ignite_offline_queue'
const MAX_RETRIES = 3

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedMessage[]>([])
  const [isOnline, setIsOnline] = useState(true)

  // Load queue from IndexedDB/localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setQueue(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load offline queue:', e)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Persist queue to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
    } catch (e) {
      console.error('Failed to persist offline queue:', e)
    }
  }, [queue])

  const addToQueue = useCallback((message: Omit<QueuedMessage, 'id' | 'createdAt' | 'retryCount'>) => {
    const queuedMessage: QueuedMessage = {
      ...message,
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      retryCount: 0
    }
    setQueue(prev => [...prev, queuedMessage])
    return queuedMessage
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(m => m.id !== id))
  }, [])

  const incrementRetry = useCallback((id: string) => {
    setQueue(prev => prev.map(m => 
      m.id === id ? { ...m, retryCount: m.retryCount + 1 } : m
    ))
  }, [])

  const getQueuedMessages = useCallback((partnerId: string, role: 'student' | 'mentor') => {
    return queue.filter(m => m.partnerId === partnerId && m.role === role)
  }, [queue])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  return {
    queue,
    isOnline,
    addToQueue,
    removeFromQueue,
    incrementRetry,
    getQueuedMessages,
    clearQueue,
    MAX_RETRIES
  }
}
