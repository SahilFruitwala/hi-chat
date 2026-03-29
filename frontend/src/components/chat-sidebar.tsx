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
import { Link } from "@tanstack/react-router"

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
  // today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const TODAY = chats.filter((c: any) => {
    const date = new Date(c.updated_at)
    // date.setHours(0, 0, 0, 0)
    return date.toDateString() === today.toDateString()
  })

  const YESTERDAY = chats.filter((c: any) => {
    const date = new Date(c.updated_at)
    return date.toDateString() === yesterday.toDateString()
  })

  const yesterdayStart = new Date(today)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  yesterdayStart.setHours(0, 0, 0, 0)

  const OLDER = chats.filter((c: any) => {
    const date = new Date(c.updated_at)
    return date.getTime() < yesterdayStart.getTime()
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
      <Link
        to="/chats/$chatId"
        params={{ chatId: chat.id.toString() }}
        className="flex w-full items-center gap-2 py-2"
        activeOptions={{
          exact: true,
        }}
        activeProps={{
          className: "bg-sidebar-accent text-sidebar-accent-foreground",
        }}
      >
        <SidebarMenuButton className="cursor-pointer" tooltip={chat.title}>
          <MessageSquare className="shrink-0" />
          <span>{chat.title}</span>
        </SidebarMenuButton>
      </Link>
      <SidebarMenuAction
        showOnHover
        className="top-1/2 flex -translate-y-1/2 items-center text-muted-foreground hover:text-destructive"
        onClick={() => {
          alert("Delete chat")
        }}
      >
        <Trash2 className="size-3.5" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  )
}
