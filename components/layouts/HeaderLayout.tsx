"use client"
import { ILayoutProps } from '@/types/global'
import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    UserCog2Icon,
    MapPinCheckIcon
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from '@/lib/hooks';
import { useSidebar } from '../ui/sidebar';
import { signOut } from "next-auth/react"

type IProps = ILayoutProps & {
    title: string;
    description: string;
    list: { type: string, href: string, label: string }[];
}
const HeaderLayout = ({ children, list, title, description }: IProps) => {
    const user = useCurrentUser();
    const { isMobile } = useSidebar()

    return (
        <div className="h-full w-full flex flex-col">
            <div className="w-full h-20 border-b flex justify-between items-center px-10">
                <div className="grid">
                    <h1 className="lg:text-xl text-base font-bold">{title}</h1>
                    <p className='lg:text-sm text-xs text-muted-foreground'>{description}</p>
                </div>
                <div className="lg:block hidden">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {list.map((item, idx) => {
                                return (
                                    <React.Fragment key={`${idx}-${item.label}`}>
                                        <BreadcrumbItem>
                                            {item.type === "link" ? <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}
                                        </BreadcrumbItem>
                                        {idx < list.length - 1 && (
                                            <BreadcrumbSeparator />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="lg:hidden block">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <MapPinCheckIcon className="size-4" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "profile"} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.name}</span>
                                        <span className="truncate text-xs">{user?.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <UserCog2Icon />
                                    {user?.role}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { signOut() }}>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>


                </div>
            </div>
            <div className="w-full flex-1">{children}</div>
        </div>
    )
}

export default HeaderLayout