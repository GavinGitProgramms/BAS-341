import React, { createContext, useState } from 'react'
import { EventType } from '../types'

export type EventContextType = {
  publish: (eventType: EventType) => void
  subscribe: (eventType: EventType, listener: () => void) => () => void
  unsubscribe: (eventType: EventType, listener: () => void) => void
}

export type EventProviderProps = {
  children: React.ReactNode
}

function defaultEventContext() {
  return {
    publish: () => {},
    subscribe: () => () => {},
    unsubscribe: () => () => {},
  }
}

export const EventContext = createContext<EventContextType>(
  defaultEventContext(),
)

export default function EventProvider({ children }: EventProviderProps) {
  const [listeners, setListeners] = useState(
    new Map<EventType, Set<() => void>>(),
  )

  function subscribe(eventType: EventType, listener: () => void) {
    setListeners((prev) => {
      const updated = new Map(prev)
      if (!updated.has(eventType)) {
        updated.set(eventType, new Set())
      }
      updated.get(eventType)!.add(listener)
      return updated
    })

    // Return unsubscribe function
    return () => {
      setListeners((prev) => {
        const updated = new Map(prev)
        updated.get(eventType)!.delete(listener)
        return updated
      })
    }
  }

  function unsubscribe(eventType: EventType, listener: () => void) {
    setListeners((prev) => {
      const updated = new Map(prev)
      updated.get(eventType)!.delete(listener)
      return updated
    })
  }

  function publish(eventType: EventType) {
    listeners.get(eventType)?.forEach((listener) => listener())
  }

  const context = { publish, subscribe, unsubscribe }

  return (
    <EventContext.Provider value={context}>{children}</EventContext.Provider>
  )
}
