import { CheckIcon } from "lucide-react"
import { memo, useCallback, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import { useModel } from "./model-provider"
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input"
import models from "@/lib/models"
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector"

const SUBMITTING_TIMEOUT = 200
const STREAMING_TIMEOUT = 2000

interface ModelItemProps {
  m: (typeof models)[0]
  selectedModel: string
  onSelect: ({
    id,
    provider,
  }: {
    id: string
    provider: string
  }) => void
}

const ModelItem = memo(({ m, selectedModel, onSelect }: ModelItemProps) => {
  const handleSelect = useCallback(
    () => onSelect({ id: m.id, provider: m.serviceProvider }),
    [onSelect, m.id, m.serviceProvider]
  )
  return (
    <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
      <ModelSelectorLogo provider={m.chefSlug} />
      <ModelSelectorName>{m.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        <ModelSelectorLogo
          key={m.serviceProvider}
          provider={m.serviceProvider}
        />
      </ModelSelectorLogoGroup>
      {selectedModel === m.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  )
})

const modelProviders = [...new Set(models.flatMap((m) => m.chef))]

ModelItem.displayName = "ModelItem"

const PromptInputBox = ({
  chatId,
  draftPrompt,
}: {
  chatId: string | null
  draftPrompt?: string
}) => {
  const { model, setModel } = useModel()
  const [provider, setProvider] = useState("")
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready")

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const selectedModelData = models.find((m) => m.id === model)

  const mutation = useMutation({
    mutationFn: async ({
      message,
      model: selectedModel,
      modelProvider,
    }: {
      message: string
      model: string
      modelProvider: string
    }) => {
      const response = chatId
        ? await fetch(`http://localhost:8000/chats/${chatId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            created_by: "user",
            model: selectedModel,
            model_provider: modelProvider,
          }),
        })
        : await fetch(`http://localhost:8000/users/1/chats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            model: selectedModel,
            model_provider: modelProvider,
          }),
        })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      return response.json()
    },
    onSuccess: (json) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      if (!chatId) {
        navigate({ to: "/chats/$chatId", params: { chatId: json.id } })
      } else {
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] })
      }
    },
    onError: () => {
      setStatus("error")
    },
  })

  const handleModelSelect = useCallback(
    ({ id, provider: serviceProvider }: { id: string; provider: string }) => {
      setModel(id)
      setProvider(serviceProvider)
      setModelSelectorOpen(false)
    },
    [setModel]
  )

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    setStatus("submitted")

    if (message.text.trim()) {
      const modelProvider = provider || selectedModelData?.serviceProvider

      if (!modelProvider) {
        setStatus("error")
        return
      }

      mutation.mutate({
        message: message.text,
        model,
        modelProvider,
      })
    }

    setTimeout(() => {
      setStatus("streaming")
    }, SUBMITTING_TIMEOUT)

    setTimeout(() => {
      setStatus("ready")
    }, STREAMING_TIMEOUT)
  }, [model, mutation, provider, selectedModelData?.serviceProvider])

  return (
    <div>
      <PromptInputProvider>
        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          {/* <PromptInputAttachmentsDisplay /> */}
          <PromptInputBody>
            <PromptInputTextarea value={draftPrompt} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {/* <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                  <PromptInputActionAddScreenshot />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu> */}
              {/* <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton> */}
              <ModelSelector
                onOpenChange={setModelSelectorOpen}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton>
                    {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo
                        provider={selectedModelData.chefSlug}
                      />
                    )}
                    {selectedModelData?.name && (
                      <ModelSelectorName>
                        {selectedModelData.name}
                      </ModelSelectorName>
                    )}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {modelProviders.map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {models
                          .filter((m) => m.chef === chef)
                          .map((m) => (
                            <ModelItem
                              key={m.id}
                              m={m}
                              onSelect={handleModelSelect}
                              selectedModel={model}
                            />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  )
}

export default PromptInputBox
