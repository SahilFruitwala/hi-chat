import { MessageSquare, Trash2 } from "lucide-react"
import { Link } from "@tanstack/react-router"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export default function ChatItem({
  chat,
  onDelete,
}: {
  chat: { id: string; title: string }
  onDelete: any
}) {
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
        onClick={() => onDelete(chat.id)}
      >
        <Trash2 className="size-3.5" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  )
}
