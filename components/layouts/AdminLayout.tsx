'use client'
import { ILayoutProps } from '@/types/global'
import React, { useMemo } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '../ui/sidebar'
import { BandageIcon, BoxIcon, Command, LayoutGridIcon, TruckIcon, User2Icon } from 'lucide-react'
import { APP_NAME } from '@/lib/utils'
import { useCurrentUser } from '@/lib/hooks'
import { NavUser } from '../ui/nav-user'
import { NavLinks } from '../ui/nav-links'
import { usePathname } from 'next/navigation'
import { NavCategories } from '../ui/nav-categories'

const AdminLayout = ({ children }: ILayoutProps) => {
    const user = useCurrentUser();
    const pathname = usePathname();

    const routes = useMemo(() => {
        return [
            {
                title: "My Dashboard",
                url: "/dashboard/admin",
                icon: LayoutGridIcon,
                isActive: pathname.includes("/dashboard/admin"),
                items: [],
            },
            {
                title: "Categories",
                url: "/categories/admin/overview",
                icon: BandageIcon,
                isActive: pathname.includes("/categories/admin"),
                items: [
                    {
                        title: "Overview",
                        url: "/categories/admin/overview",
                    },
                    {
                        title: "Create New",
                        url: "/categories/admin/create",
                    },
                ],
            },
            {
                title: "Inventory",
                url: "/inventory/admin/restock",
                icon: BoxIcon,
                isActive: pathname.includes("/inventory/admin"),
                items: [
                    // {
                    //     title: "Overview",
                    //     url: "/inventory/admin/overview",
                    // },
                    {
                        title: "Restock",
                        url: "/inventory/admin/restock",
                    },
                ],
            },
            {
                title: "Transactions",
                url: "/transactions/admin/overview",
                icon: TruckIcon,
                isActive: pathname.includes("/transactions/admin"),
                items: [
                    {
                        title: "Overview",
                        url: "/transactions/admin/overview",
                    },
                    {
                        title: "Invoices",
                        url: "/transactions/admin/invoices",
                    },
                    {
                        title: "Point of Sale",
                        url: "/transactions/admin/pos",
                    },
                ],
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
                    <NavCategories />
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

export default AdminLayout