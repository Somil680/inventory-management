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

  const openItemModal = () => {
    dispatch(
      openModal({
        type: 'Items',
      })
    )
  }
  const openPartyModal = () => {
    dispatch(
      openModal({
        type: 'Party',
      })
    )
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
            <Link href={'/properties'} className=" w-full">
              <span>{'Properties'}</span>
            </Link>
            {/* <Plus className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
          </SidebarMenuButton>
          <SidebarMenuButton tooltip={'oo'}>
            {<ShoppingBasket />}
            <Link href={'/items'} className=" w-full">
              <span>{'Items'}</span>
            </Link>
            <Plus
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              onClick={() => openItemModal()}
            />
          </SidebarMenuButton>
          <SidebarMenuButton tooltip={'oo'}>
            {<Users />}
            <Link href={'/parties'} className=" w-full">
              <span>{'Parties'}</span>
            </Link>
            <Plus
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              onClick={() => openPartyModal()}
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
            {<Wallet/>}
            <Link href={'/expenses'} className=" w-full">
              <span>{'Expenses'}</span>
            </Link>
            <Plus
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              onClick={() => openPartyModal()}
            />
          </SidebarMenuButton>
       
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
