import { MessageSquare, Plus, Trash2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const DUMMY_CHATS = [
  { id: 1, title: "How does React work?", updatedAt: "Today" },
  { id: 2, title: "Fix my Python script", updatedAt: "Today" },
  { id: 3, title: "Explain async/await", updatedAt: "Yesterday" },
  { id: 4, title: "Best practices for REST APIs", updatedAt: "Yesterday" },
  { id: 5, title: "TypeScript generics deep dive", updatedAt: "Mar 27" },
  { id: 6, title: "CSS Grid vs Flexbox", updatedAt: "Mar 26" },
  { id: 7, title: "Setting up Postgres locally", updatedAt: "Mar 25" },
]

const TODAY = DUMMY_CHATS.filter((c) => c.updatedAt === "Today")
const YESTERDAY = DUMMY_CHATS.filter((c) => c.updatedAt === "Yesterday")
const OLDER = DUMMY_CHATS.filter(
  (c) => c.updatedAt !== "Today" && c.updatedAt !== "Yesterday"
)

export function ChatSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-3">
        <Button
          className="w-full justify-start gap-2 p-5 font-medium"
          variant="default"
          size="lg"
        >
          <Plus className="size-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {TODAY.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Today</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {TODAY.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {YESTERDAY.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {YESTERDAY.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {OLDER.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Older</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {OLDER.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <p className="text-center text-xs text-muted-foreground">
          hi-chat · v0.1
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}

function ChatItem({ chat }: { chat: { id: number; title: string } }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="cursor-pointer" tooltip={chat.title}>
        <MessageSquare className="shrink-0" />
        <span>{chat.title}</span>
      </SidebarMenuButton>
      <SidebarMenuAction
        showOnHover
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  )
}
