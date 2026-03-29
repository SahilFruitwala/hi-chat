import { Plus } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import ChatItem from "./chat-item"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface Chat {
  id: string
  title: string
  updated_at: string
}
export function ChatSidebar() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const state = useRouterState()
  const activeChatId = (
    state.matches.find((m) => m.routeId === "/chats/$chatId")?.params as any
  )?.chatId

  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      fetch("http://localhost:8000/users/1/chats").then((r) => r.json()),
  })

  const mutation = useMutation({
    mutationFn: (chatId: string) => {
      return fetch(`http://localhost:8000/users/1/chats/${chatId}`, {
        method: "DELETE",
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      if (activeChatId && String(activeChatId) === String(variables)) {
        queryClient.invalidateQueries({ queryKey: ["messages", variables] })
        navigate({ to: "/" })
      }
    },
  })

  if (!chats) {
    return <div>Loading...</div>
  }

  const today = new Date()
  // today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const TODAY = chats.filter((c: Chat) => {
    const date = new Date(c.updated_at)
    // date.setHours(0, 0, 0, 0)
    return date.toDateString() === today.toDateString()
  })

  const YESTERDAY = chats.filter((c: Chat) => {
    const date = new Date(c.updated_at)
    return date.toDateString() === yesterday.toDateString()
  })

  const yesterdayStart = new Date(today)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  yesterdayStart.setHours(0, 0, 0, 0)

  const OLDER = chats.filter((c: Chat) => {
    const date = new Date(c.updated_at)
    return date.getTime() < yesterdayStart.getTime()
  })

  const handleDelete = (chatId: string) => {
    mutation.mutate(chatId)
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-3">
        <Link to="/">
          <Button
            className="w-full justify-start gap-2 p-5 font-medium"
            variant="default"
            size="lg"
          >
            <Plus className="size-4" />
            New Chat
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {TODAY.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Today</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {TODAY.map((chat: Chat) => (
                  <ChatItem key={chat.id} chat={chat} onDelete={handleDelete} />
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
                {YESTERDAY.map((chat: Chat) => (
                  <ChatItem key={chat.id} chat={chat} onDelete={handleDelete} />
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
                {OLDER.map((chat: Chat) => (
                  <ChatItem key={chat.id} chat={chat} onDelete={handleDelete} />
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
