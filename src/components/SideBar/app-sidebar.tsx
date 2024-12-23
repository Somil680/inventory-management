'use client'

import * as React from 'react'
import {
  AudioWaveform,
  ShoppingCart,
  Command,
  GalleryVerticalEnd,
  ReceiptIndianRupee,
} from 'lucide-react'

import { NavMain } from '@/components/SideBar/nav-main'
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from '@/components/SideBar/nav-user'
import { TeamSwitcher } from '@/components/SideBar/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Sales',
      url: '#',
      icon: ReceiptIndianRupee,
      isActive: true,
      items: [
        {
          title: 'Sale Invoices',
          url: '#',
        },
        {
          title: 'Estimate/ Quotation',
          url: '#',
        },
        {
          title: 'Sale Order',
          url: '#',
        },
        {
          title: 'Delivery Challan',
          url: '#',
        },
        {
          title: 'Sale Return/ Cr. Note',
          url: '#',
        },
      ],
    },
    {
      title: 'Purchase & Expense',
      url: '#',
      icon: ShoppingCart,
      items: [
        {
          title: 'Purchase Bills',
          url: '#',
        },
        {
          title: 'Payment Out',
          url: '#',
        },
        {
          title: 'Expenses',
          url: '#',
        },
        {
          title: 'Purchase Order',
          url: '#',
        },
        {
          title: 'Purchase Return/ Dr. Note',
          url: '#',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
