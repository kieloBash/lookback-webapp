"use client"

import {
    EditIcon,
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
import { handlePostAxios } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { CATEGORIES_ROUTES } from "@/routes/categories.routes"

export function NavCategories() {
    const { isMobile } = useSidebar()
    const categories = useAdminCategories({})
    const queryClient = useQueryClient();

    const handleSuccessDelete = () => {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
    }

    const handleDeleteCategory = async (id: string) => {
        await handlePostAxios({ values: { id }, route: CATEGORIES_ROUTES.ADMIN.DELETE.URL, handleSuccess: handleSuccessDelete })
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarMenu>
                {categories?.payload?.map((item) => {
                    const total = item.items.reduce((acc, i) => acc + i.quantity, 0);
                    return (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton asChild>
                                <Link href={`/categories/admin/view/${item.id}`}>
                                    <span><UiCategoriesIcon icon={item.icon} className="size-4" /></span>
                                    <span>{item.name}</span>
                                    <span className="font-medium">{total}</span>
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
                                    <Link href={`/categories/admin/view/${item.id}`}>
                                        <DropdownMenuItem>
                                            <Folder className="text-muted-foreground" />
                                            <span>View Category</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href={`/categories/admin/update/${item.id}`}>
                                        <DropdownMenuItem>
                                            <EditIcon className="text-muted-foreground" />
                                            <span>Edit Category</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={() => handleDeleteCategory(item.id)}>
                                        <Trash2 className="text-muted-foreground" />
                                        <span>Delete Category</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    )
                })}
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
