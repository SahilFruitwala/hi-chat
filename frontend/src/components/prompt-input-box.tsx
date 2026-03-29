// import {
//   Attachment,
//   AttachmentPreview,
//   AttachmentRemove,
//   Attachments,
// } from "@/components/ai-elements/attachments"
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
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input"
import {
  PromptInput,
  // PromptInputActionAddAttachments,
  // PromptInputActionAddScreenshot,
  // PromptInputActionMenu,
  // PromptInputActionMenuContent,
  // PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input"
import { CheckIcon, GlobeIcon } from "lucide-react"
import { memo, useCallback, useState } from "react"
import models from "@/lib/models"

const SUBMITTING_TIMEOUT = 200
const STREAMING_TIMEOUT = 2000

// interface AttachmentItemProps {
//   attachment: {
//     id: string
//     type: "file"
//     filename?: string
//     mediaType?: string
//     url: string
//   }
//   onRemove: (id: string) => void
// }

// const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
//   const handleRemove = useCallback(
//     () => onRemove(attachment.id),
//     [onRemove, attachment.id]
//   )
//   return (
//     <Attachment data={attachment} key={attachment.id} onRemove={handleRemove}>
//       <AttachmentPreview />
//       <AttachmentRemove />
//     </Attachment>
//   )
// })

// AttachmentItem.displayName = "AttachmentItem"

interface ModelItemProps {
  m: (typeof models)[0]
  selectedModel: string
  onSelect: (id: string) => void
}

const ModelItem = memo(({ m, selectedModel, onSelect }: ModelItemProps) => {
  const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id])
  return (
    <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
      <ModelSelectorLogo provider={m.chefSlug} />
      <ModelSelectorName>{m.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {m.providers.map((provider) => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
      {selectedModel === m.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  )
})

ModelItem.displayName = "ModelItem"

// const PromptInputAttachmentsDisplay = () => {
//   const attachments = usePromptInputAttachments()

//   const handleRemove = useCallback(
//     (id: string) => attachments.remove(id),
//     [attachments]
//   )

//   if (attachments.files.length === 0) {
//     return null
//   }

//   return (
//     <Attachments variant="inline">
//       {attachments.files.map((attachment) => (
//         <AttachmentItem
//           attachment={attachment}
//           key={attachment.id}
//           onRemove={handleRemove}
//         />
//       ))}
//     </Attachments>
//   )
// }

const PromptInputBox = ({
  model,
  setModel,
  onSubmit,
}: {
  model: string
  setModel: (model: string) => void
  onSubmit: (message: PromptInputMessage) => void
}) => {
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready")

  const selectedModelData = models.find((m) => m.id === model)

  const handleModelSelect = useCallback((id: string) => {
    setModel(id)
    setModelSelectorOpen(false)
  }, [])

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    setStatus("submitted")

    // eslint-disable-next-line no-console
    onSubmit(message)

    setTimeout(() => {
      setStatus("streaming")
    }, SUBMITTING_TIMEOUT)

    setTimeout(() => {
      setStatus("ready")
    }, STREAMING_TIMEOUT)
  }, [])

  return (
    <div>
      <PromptInputProvider>
        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          {/* <PromptInputAttachmentsDisplay /> */}
          <PromptInputBody>
            <PromptInputTextarea />
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
              <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
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
                    {["OpenAI", "Anthropic", "Google"].map((chef) => (
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
