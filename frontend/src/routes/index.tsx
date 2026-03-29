import { NewChat } from "@/components/new-chat"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex h-full w-full flex-col">
      <NewChat />
    </div>
  )
}
