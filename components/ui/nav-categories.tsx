"use client"

import {
    Folder,
    Forward,
    MoreHorizontal,
    PlusIcon,
    Trash2,
    type LucideIcon,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import useAdminCategories from "@/hooks/admin/use-categories"
import UiCategoriesIcon from "./ui-categories-icon"

export function NavCategories() {
    const { isMobile } = useSidebar()
    const categories = useAdminCategories({})

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarMenu>
                {categories?.payload?.map((item) => (
                    <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild>
                            <Link href={`/category/admin/view/${item.id}`}>
                                <span><UiCategoriesIcon icon={item.icon} className="size-4" /></span>
                                <span>{item.name}</span>
                                {/* <span className="font-bold">{item.count}</span> */}
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <Link href={`/category/admin/view/${item.id}`}>
                                    <DropdownMenuItem>
                                        <Folder className="text-muted-foreground" />
                                        <span>View Category</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <Link href={`/category/admin/delete/${item.id}`}>
                                    <DropdownMenuItem>
                                        <Trash2 className="text-muted-foreground" />
                                        <span>Delete Category</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <Link href={"/categories/admin/create"}>
                        <SidebarMenuButton className="text-sidebar-foreground/70">
                            <PlusIcon className="text-sidebar-foreground/70" />
                            <span>Add Category</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
