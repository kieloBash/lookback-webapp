'use client'
import { ILayoutProps } from '@/types/global'
import React, { useMemo } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from '../ui/sidebar'
import { BellIcon, HistoryIcon, MapPinCheckIcon, ScanQrCodeIcon, SettingsIcon, QrCodeIcon } from 'lucide-react'
import { APP_NAME } from '@/lib/utils'
import { useCurrentUser } from '@/lib/hooks'
import { NavUser } from '../ui/nav-user'
import { NavLinks } from '../ui/nav-links'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/button'

const UserLayout = ({ children }: ILayoutProps) => {
    const user = useCurrentUser();
    const pathname = usePathname();

    const { isMobile } = useSidebar()

    const routes = useMemo(() => {
        return [
            {
                title: "History",
                url: "/history/user",
                icon: HistoryIcon,
                isActive: pathname.includes("/history/user"),
                items: [],
            },
            {
                title: "Scanner",
                url: "/scanner/user",
                icon: ScanQrCodeIcon,
                isActive: pathname.includes("/scanner/user"),
                items: [],
            },
            {
                title: "Notifications",
                url: "/notifications/user",
                icon: BellIcon,
                isActive: pathname.includes("/notifications/user"),
                items: [],
            },
            {
                title: "Settings",
                url: "/settings/user",
                icon: SettingsIcon,
                isActive: pathname.includes("/settings/user"),
                items: [],
            },
        ]
    }, [pathname])

    if (!user) return null;

    return (
        <>
            {isMobile ? (
                <div className='relative w-full h-full'>
                    <div className="w-full h-full pb-24">
                        {children}
                    </div>
                    <div className="w-full h-24 fixed bottom-0 leftt-0 bg-sidebar border-t p-4 grid grid-cols-4 gap-2">
                        {routes.map((r) => {
                            return (
                                <Link href={r.url} key={r.title}>
                                    <Button type='button' className='size-full p-1 flex flex-col gap-1 justify-center items-center' variant={r.isActive ? "default" : "outline"}>
                                        <r.icon className='w-8 h-8' />
                                        <span className="text-xs">{r.title}</span>
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ) : <>
                <Sidebar variant="inset">
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" asChild>
                                    <Link href="/history">
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                            <MapPinCheckIcon className="size-4" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{APP_NAME}</span>
                                            <span className="truncate text-xs">Covid Tracker</span>
                                        </div>
                                    </Link>
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
            </>}
        </>
    )
}

export default UserLayout