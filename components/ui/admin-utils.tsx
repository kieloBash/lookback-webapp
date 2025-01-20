'use client'
import {
    Eye,
    Settings2Icon,
    UserPlus,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createAdminAccount } from "@/lib/admin-tools"
import { toast } from "@/hooks/use-toast"

export default function UiAdminUtils() {

    async function handleCreateAdminAccount() {
        toast({ description: "Please wait while we create an admin account" })
        const res = await createAdminAccount({})
        if (res?.success) {
            toast({ description: `Email: admin@gmail.com Password:User1234!` })
        } else {
            toast({ description: res?.error, variant: "destructive" })
        }
    }

    return (
        <div className="fixed lg:bottom-10 bottom-36 mb-2 right-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Settings2Icon className="absolute h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Toggle Admin Utils</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Admin Utilities</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Users />
                                <span>User</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={handleCreateAdminAccount}>
                                    <UserPlus />
                                    <span>Create admin account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <div className="grid text-xs">
                                        <span>Email: admin@gmail.com</span>
                                        <span>Pass: User1234!</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
