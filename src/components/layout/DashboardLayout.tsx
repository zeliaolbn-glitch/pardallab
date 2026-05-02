import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Outlet } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'

export function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto bg-gray-50/50">
            <header className="flex h-16 items-center border-b bg-white px-4 md:px-6">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1">
                {/* Espaço para busca ou título da página se necessário */}
              </div>
            </header>
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
