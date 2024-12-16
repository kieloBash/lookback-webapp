'use client'
import { ILayoutProps } from '@/types/global'
import React, { useMemo } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '../ui/sidebar'
import { BandageIcon, BoxIcon, Command, LayoutGridIcon, TruckIcon } from 'lucide-react'
import { APP_NAME } from '@/lib/utils'
import { useCurrentUser } from '@/lib/hooks'
import { NavUser } from '../ui/nav-user'
import { NavLinks } from '../ui/nav-links'
import { usePathname } from 'next/navigation'

const StaffLayout = ({ children }: ILayoutProps) => {
    const user = useCurrentUser();
    const pathname = usePathname();

    const routes = useMemo(() => {
        return [
            {
                title: "My Dashboard",
                url: "/dashboard/staff",
                icon: LayoutGridIcon,
                isActive: pathname.includes("/dashboard/staff"),
                items: [],
            },
            // {
            //     title: "Categories",
            //     url: "/categories/overview",
            //     icon: BandageIcon,
            //     isActive: pathname.includes("/categories/overview"),
            //     items: [
            //         {
            //             title: "Overview",
            //             url: "/categories/overview",
            //         },
            //         {
            //             title: "Create New",
            //             url: "/categories/create",
            //         },
            //     ],
            // },
            {
                title: "Inventory",
                url: "/inventory/staff",
                icon: BoxIcon,
                isActive: pathname.includes("/inventory/staff"),
                items: [],
            },
            {
                title: "Transactions",
                url: "/transactions/staff",
                icon: TruckIcon,
                isActive: pathname.includes("/transactions/staff"),
                items: [],
            },
        ]
    }, [pathname])

    if (!user) return null;

    return (
        <SidebarProvider>
            <Sidebar variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <a href="#">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Command className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{APP_NAME}</span>
                                        <span className="truncate text-xs">System</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavLinks items={routes} />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={user as any} />
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default StaffLayout