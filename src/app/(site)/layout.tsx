'use client'
// import type { Metadata } from 'next'
// import './globals.css'
import { Toaster } from '@/components/ui/sonner'

import { AppSidebar } from '@/components/SideBar/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Plus } from 'lucide-react'
import ModalManager from '@/components/_modals/modalManager'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full   flex bg-primary text-black">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset >
          <header className="border flex  h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
            <div className="flex justify-between w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex justify-center gap-2">
                <button className="shadow-lg gap-2 h-[35px] text-lg py-2 px-4 items-center flex justify-center rounded-3xl bg-[#ffd7dc] text-[#f03d3b] hover:bg-[#ffbab6] ">
                  {<Plus />}
                  Add Sale
                </button>
                <button className="shadow-lg gap-2 h-[35px] text-lg py-2 px-4 items-center flex justify-center rounded-3xl bg-[#cce6ff] text-[#3f75e8] hover:bg-[#b5d5f3]">
                  {<Plus />}
                  Add Purchase
                </button>
              </div>
            </div>
          </header>
          <div className="bg-[#cfdbe6] h-full">{children}</div>
          <Toaster richColors  position='top-right' theme='light'/>
        </SidebarInset>
      </SidebarProvider>
      <ModalManager />
    </div>
  )
}
