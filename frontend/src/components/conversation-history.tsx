import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import { MessageSquare } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import PromptInputBox from "./prompt-input-box"

const ConversationHistory = ({ chatId }: { chatId: string }) => {
  const { data: chat } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () =>
      fetch(`http://localhost:8000/users/1/chats/${chatId}`).then((res) =>
        res.json()
      ),
  })

  if (!chat?.messages?.length) {
    return <div>No messages</div>
  }

  return (
    <div className="relative mx-auto size-full h-full max-w-4xl overflow-hidden p-0">
      <div className="flex h-full flex-col overflow-hidden">
        <Conversation>
          <ConversationContent>
            {chat.messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              chat.messages.map((message: any) => (
                <Message from={message.created_by} key={message.id}>
                  <MessageContent>
                    <MessageResponse>{message.message}</MessageResponse>
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
          <PromptInputBox chatId={chatId} />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationHistory
