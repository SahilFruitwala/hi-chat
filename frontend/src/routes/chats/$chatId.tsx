import ConversationHistory from "@/components/conversation-history"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/chats/$chatId")({
  // In a loader
  loader: ({ params }) =>
    fetch(`http://localhost:8000/users/1/chats/${params.chatId}`).then((r) =>
      r.json()
    ),
  // Or in a component
  component: ChatComponent,
  ssr: false,
})

function ChatComponent() {
  const chat = Route.useLoaderData()
  return <ConversationHistory messages={chat.messages} />
}
