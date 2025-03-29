'use client'

import {
  ChevronRight,
  Group,
  Home,
  Plus,
  ShoppingBasket,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import { useQueryClient } from '@tanstack/react-query'
import { fetchExpensesCategory } from '@/lib/ExpenseAction'
import { fetchProduct } from '@/lib/productAction'
import { fetchParty } from '@/lib/client'
import { fetchProperties } from '@/lib/actions'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const handleOpenModal = (type: string) => {
    dispatch(
      openModal({
        type: type,
      })
    )
  }
  const prefetchExpenseData = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['ExpenseCategory'],
      queryFn: fetchExpensesCategory,
    })
  }
  const prefetchProductData = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['Product'],
      queryFn: fetchProduct,
    })
  }
  const prefetchPartyData = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['Party'],
      queryFn: fetchParty,
    })
  }
  const prefetchPropertiesData = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['Properties'],
      queryFn: fetchProperties,
    })
  }

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={'oo'}>
            {<Home />}
            <Link href={'/'} className=" w-full">
              <span>{'Home'}</span>
            </Link>
            {/* <Plus className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
          </SidebarMenuButton>
          <SidebarMenuButton tooltip={'oo'}>
            {<Group />}
            <Link
              href={'/properties'}
              className=" w-full"
              onMouseEnter={prefetchPropertiesData}
            >
              <span>{'Properties'}</span>
            </Link>
            {/* <Plus className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
          </SidebarMenuButton>
          <SidebarMenuButton tooltip={'oo'}>
            {<ShoppingBasket />}
            <Link
              href={'/items'}
              className=" w-full"
              onMouseEnter={prefetchProductData}
            >
              <span>{'Items'}</span>
            </Link>
            <Plus
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              onClick={() => handleOpenModal('Item')}
            />
          </SidebarMenuButton>
          <SidebarMenuButton tooltip={'oo'}>
            {<Users />}
            <Link
              href={'/parties'}
              className=" w-full"
              onMouseEnter={prefetchPartyData}
            >
              <span>{'Parties'}</span>
            </Link>
            <Plus
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              onClick={() => handleOpenModal('Party')}
            />
          </SidebarMenuButton>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <Link href={item.url}>
                      <span>{item.title}</span>
                    </Link>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          <SidebarMenuButton tooltip={'oo'}>
            {<Wallet />}
            <Link
              href={'/expenses'}
              className=" w-full"
              onMouseEnter={prefetchExpenseData}
            >
              <span>{'Expenses'}</span>
            </Link>
            <Plus
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              onClick={() => handleOpenModal('Expense')}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
