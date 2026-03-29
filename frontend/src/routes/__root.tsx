import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Sidebar } from "@/components/ui/sidebar"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

const queryClient = new QueryClient()

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
              <Sidebar />
              <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <header className="flex items-center justify-between px-4 py-3 border-b">
                  <SidebarTrigger />
                  <ModeToggle />
                </header>
                <main className="flex flex-1 overflow-hidden w-full">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </QueryClientProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
