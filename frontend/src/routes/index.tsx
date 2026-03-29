import { createFileRoute } from "@tanstack/react-router"
import { NewChat } from "@/components/new-chat"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex h-full w-full flex-col">
      <NewChat />
    </div>
  )
}
