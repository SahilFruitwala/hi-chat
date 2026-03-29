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
import { type PromptInputMessage } from "@/components/ai-elements/prompt-input"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import models from "@/lib/models"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import PromptInputBox from "./prompt-input-box"

const ConversationHistory = ({ chatId }: { chatId: string }) => {
  const [model, setModel] = useState<string>(models[0].id)

  const queryClient = useQueryClient()

  const { data: chat } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => {
      return fetch(`http://localhost:8000/users/1/chats/${chatId}`).then(
        (res) => res.json()
      )
    },
  })

  const mutation = useMutation({
    mutationFn: (message: string) => {
      return fetch(`http://localhost:8000/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          created_by: "user",
          model,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] })
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim()) {
      mutation.mutate(message.text)
    }
  }

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

        <PromptInputBox
          model={model}
          setModel={setModel}
          onSubmit={handleSubmit}
        />

        {/* <PromptInput
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
        </PromptInput> */}
      </div>
    </div>
  )
}

export default ConversationHistory
