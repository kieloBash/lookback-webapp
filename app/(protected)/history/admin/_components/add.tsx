'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { createHistory } from "@/lib/history"
import { USERS_ROUTES } from "@/routes/users.routes"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export function AddModal() {
    const queryClient = useQueryClient()
    const [user, setUser] = useState("user_test@gmail.com")
    const [management, setManagement] = useState("management_test@gmail.com")
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        console.log(user, management, date);
        setIsLoading(true)
        const res = await createHistory(user, management, date);
        console.log(res);
        if (res?.data) {
            queryClient.invalidateQueries({ queryKey: [USERS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false });
            toast({ description: "Success" })
            setOpen(false);
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New History</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            User Email
                        </Label>
                        <Input
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            id="name"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="management" className="text-right">
                            Management Email
                        </Label>
                        <Input
                            value={management}
                            onChange={(e) => setManagement(e.target.value)}
                            id="management"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input
                            value={date.toISOString().split("T")[0]}
                            onChange={(e) => setDate(new Date(e.target.value))}
                            id="date"
                            type="date"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={isLoading} onClick={handleSubmit} type="button">Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
