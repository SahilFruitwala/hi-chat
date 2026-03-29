import { Code2, Globe, PenTool, Sparkles, Zap } from "lucide-react"
import PromptInputBox from "./prompt-input-box"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function NewChat() {
  const examples = [
    {
      title: "Write & Summarize",
      description: "Draft a blog post about AI trends in 2024",
      icon: <PenTool className="size-5 text-blue-500" />,
    },
    {
      title: "Code Assistant",
      description: "Build a responsive grid layout using CSS Flexbox",
      icon: <Code2 className="size-5 text-emerald-500" />,
    },
    {
      title: "Data Analysis",
      description: "Create a sales forecast from monthly spreadsheet data",
      icon: <Zap className="size-5 text-amber-500" />,
    },
    {
      title: "Translate & Localize",
      description: "Translate this product page into Spanish and French",
      icon: <Globe className="size-5 text-indigo-500" />,
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="mx-auto no-scrollbar flex w-full max-w-4xl flex-1 flex-col items-center justify-center overflow-y-auto p-6">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Sparkles className="size-8 text-primary" />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Hi, I'm your AI Assistant
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            How can I help you today? Choose an example below or start typing.
          </p>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
          {examples.map((example, i) => (
            <Card
              key={i}
              className="cursor-pointer border-none shadow-none ring-1 ring-sidebar-border transition-all hover:scale-[1.02] hover:bg-muted/50 active:scale-[0.98]"
            >
              <CardHeader className="flex flex-row items-center gap-4 py-5">
                <div className="rounded-xl bg-muted p-2.5">{example.icon}</div>
                <div className="space-y-1">
                  <CardTitle className="text-sm leading-none font-medium">
                    {example.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 text-xs">
                    {example.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
        <PromptInputBox chatId={null} />
        <p className="mt-4 text-center text-xs text-muted-foreground">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}
