"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  GalleryVerticalEnd,
  Home,
  Users,
  BookOpen,
  Settings2,
  SquareTerminal,
  ChevronRight,
  User,
  LogOut,
  Mail,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavItem = {
  title: string
  url: string
  isActive?: boolean
  icon?: React.ComponentType<{ className?: string }>
  items?: NavItem[]
}

// Mock data for the sidebar
const data = {
  user: {
    name: "Alex Johnson",
    email: "alex.johnson@akpsi.org",
    avatar: "/avatars/alex.jpg",
    role: "Chapter President",
    credits: 85,
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
      items: [
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Other",
          url: "#",
        },
      ],
    },
    {
      title: "Directors",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Pro-Credits",
          url: "#",
        },
        {
          title: "Brotherhood",
          url: "#",
          isActive: true,
        },
        {
          title: "Education",
          url: "#",
        },
        {
          title: "Service",
          url: "#",
        },
        {
          title: "Fundraising",
          url: "#",
        },
        {
          title: "Rush",
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Alumni Contact",
          url: "#",
        },
        {
          title: "Master Spreadsheet",
          url: "#",
        },
      ],
    },
  ],
}

// Navigation User Component
function NavUser({ user }: { user: typeof data.user }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.role}</span>
          </div>
          <ChevronRight className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Mail className="h-4 w-4" />
          Inbox
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Settings2 className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full overflow-hidden">
                  <Image src="/akpsilogo.jpg" alt="AKPsi" width={36} height={36} className="object-cover scale-125" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Alpha Kappa Psi</span>
                  <span className="">Omega Phi</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const Icon = item.icon
              return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium flex items-center gap-2">
                    {Icon ? <Icon className="size-4" /> : null}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const SubIcon = subItem.icon
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                            <a href={subItem.url} className="flex items-center gap-2">
                              {SubIcon ? <SubIcon className="size-4" /> : null}
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser user={data.user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
