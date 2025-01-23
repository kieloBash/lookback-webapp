import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

export function AlertModal({ open, setOpen }: { open: boolean, setOpen: (e: boolean) => void }) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="w-[360px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Welcome!</AlertDialogTitle>
                    <AlertDialogDescription>
                        We have sent you an email verification to your email. To proceed, please verify your email.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row justify-center mt-4 items-center">
                    <Link href="/auth/sign-in">
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </Link>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
