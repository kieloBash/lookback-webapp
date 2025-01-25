'use client'
import { ILayoutProps } from '@/types/global'
import React, { useMemo } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { BandageIcon, BellIcon, BoxIcon, Command, HistoryIcon, LayoutGridIcon, MapPinCheckIcon, MessageCircleMore, SettingsIcon, TruckIcon, User2Icon } from 'lucide-react'
import { APP_NAME } from '@/lib/utils'
import { useCurrentUser } from '@/lib/hooks'
import { NavUser } from '../ui/nav-user'
import { NavLinks } from '../ui/nav-links'
import { usePathname } from 'next/navigation'

const HeadAdminLayout = ({ children }: ILayoutProps) => {
    const user = useCurrentUser();
    const pathname = usePathname();

    const routes = useMemo(() => {
        return [
            {
                title: "History",
                url: "/history/admin",
                icon: HistoryIcon,
                isActive: pathname.includes("/history/admin"),
                items: [],
            },
            {
                title: "Requests",
                url: "/requests/admin",
                icon: MessageCircleMore,
                isActive: pathname.includes("/requests/admin"),
                items: [],
            },
            {
                title: "Users",
                url: "/users/admin/overview",
                icon: User2Icon,
                isActive: pathname.includes("/users/admin"),
                items: [
                    {
                        title: "Overview",
                        url: "/users/admin/overview",
                    },
                    {
                        title: "Create",
                        url: "/users/admin/create",
                    },
                ],
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
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <MapPinCheckIcon className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{APP_NAME}</span>
                                        <span className="truncate text-xs">Covid Tracker</span>
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
                <SidebarTrigger className="lg:hidden fixed top-4 right-4" />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default HeadAdminLayout