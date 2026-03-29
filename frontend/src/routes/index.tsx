import { ClientOnly } from "@tanstack/react-router"

import { createFileRoute } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ConversationHistory from "@/components/conversation-history"

export const Route = createFileRoute("/")({ component: App })
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientOnly>
        <ConversationHistory />
      </ClientOnly>
    </QueryClientProvider>
  )
}
