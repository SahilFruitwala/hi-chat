import { ClientOnly } from "@tanstack/react-router"

import { createFileRoute } from "@tanstack/react-router"
import ConversationHistory from "@/components/conversation-history"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <ClientOnly>
      <div className="flex flex-col w-full h-full">
        <ConversationHistory />
      </div>
    </ClientOnly>
  )
}
