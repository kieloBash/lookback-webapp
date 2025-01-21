import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { handleAxios } from "@/lib/utils";
import { USERS_ROUTES } from "@/routes/users.routes";
import { useQueryClient } from "@tanstack/react-query";

interface IProps {
    open: boolean;
    setOpen: (e: boolean) => void;
    data: any;
}

export function DeleteModal({ data, open, setOpen }: IProps) {
    const queryClient = useQueryClient();

    async function handleConfirm() {
        await handleAxios({ values: { id: data.id }, url: USERS_ROUTES.ADMIN.DELETE.URL })
            .then((res) => {
                queryClient.invalidateQueries({ queryKey: [USERS_ROUTES.ADMIN.FETCH_ALL.KEY] })
            })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the account and remove the data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
