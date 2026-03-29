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
import { useQuery } from "@tanstack/react-query"

export function ChatSidebar() {
  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      fetch("http://localhost:8000/users/1/chats").then((r) => r.json()),
  })

  if (!chats) {
    return <div>Loading...</div>
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const TODAY = chats.filter((c: any) => {
    const date = new Date(c.updated_at || c.updatedAt)
    date.setHours(0, 0, 0, 0)
    return date.getTime() === today.getTime()
  })

  const YESTERDAY = chats.filter((c: any) => {
    const date = new Date(c.updated_at || c.updatedAt)
    date.setHours(0, 0, 0, 0)
    return date.getTime() === yesterday.getTime()
  })

  const OLDER = chats.filter((c: any) => {
    const date = new Date(c.updated_at || c.updatedAt)
    date.setHours(0, 0, 0, 0)
    return date.getTime() < yesterday.getTime()
  })

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
