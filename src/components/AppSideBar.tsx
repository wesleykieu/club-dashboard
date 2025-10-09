import * as React from "react"
import Image from "next/image"
import {
  GalleryVerticalEnd,
  Home,
  Users,
  BookOpen,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  isActive?: boolean
  icon?: React.ComponentType<{ className?: string }>
  items?: NavItem[]
}

// This is sample data.
const data: { navMain: NavItem[] } = {
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
        {
          title: "Funraising",
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
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
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
      <SidebarRail />
    </Sidebar>
  )
} 