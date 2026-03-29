import React, { createContext, useContext, useEffect, useState } from "react"
import models from "@/lib/models"

interface ModelContextType {
  model: string
  setModel: (model: string) => void
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

const STORAGE_KEY = "hi-chat-selected-model"

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<string>(models[0].id)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && models.some((m) => m.id === saved)) {
        setModel(saved)
      }
    }
  }, [])

  const updateModel = (newModel: string) => {
    setModel(newModel)
    localStorage.setItem(STORAGE_KEY, newModel)
  }

  return (
    <ModelContext.Provider value={{ model, setModel: updateModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider")
  }
  return context
}
