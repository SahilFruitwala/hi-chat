import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input"
import { MessageSquare } from "lucide-react"
import { useState } from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const Convo = () => {
  const [input, setInput] = useState("")

  const queryClient = useQueryClient()

  const { data: chat } = useQuery({
    queryKey: ["messages"],
    queryFn: () => {
      return fetch("http://localhost:8000/users/1/chats/1").then((res) =>
        res.json()
      )
    },
  })

  const mutation = useMutation({
    mutationFn: (message: string) => {
      return fetch("http://localhost:8000/chats/1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          created_by: "user",
        }),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["messages"] })
    },
  })

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim()) {
      mutation.mutate(message.text)
      setInput("")
    }
  }

  if (!chat) {
    return <div>Loading...</div>
  }

  return (
    <div className="relative mx-auto size-full h-screen max-w-4xl p-0">
      <div className="flex h-full flex-col">
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

        <PromptInput
          onSubmit={handleSubmit}
          className="relative mx-auto mt-4 w-full max-w-2xl"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute right-1 bottom-1"
          />
        </PromptInput>
      </div>
    </div>
  )
}

export default Convo
