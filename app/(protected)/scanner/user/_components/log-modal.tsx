import UiLoading from "@/components/ui-project/loading-page";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface IProps {
    open: boolean;
    setOpen: (e: boolean) => void;

}
export default function HistoryLogModal({ open, setOpen: onOpenChange }: IProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-xs">
                <DialogHeader>
                    <DialogTitle>History Logs</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center gap-4">
                    <p className="text-lg text-center text-muted-foreground">Thank you for scanning the QR Code. Please wait while we update your history.</p>
                    <UiLoading />
                </div>
            </DialogContent>
        </Dialog>
    )
}
