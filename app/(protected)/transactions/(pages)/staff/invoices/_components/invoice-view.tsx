import React, { useMemo } from 'react'
import { useSearchParams } from "next/navigation";
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FORMAT, formatPricingNumber, handlePostAxios } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CopyIcon, TrashIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { INVOICE_ROUTES } from '@/routes/invoice.routes';
import useStaffInvoices from '@/hooks/staff/use-invoices';

interface IProps { selected: string }

const InvoiceView = ({ selected }: IProps) => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const limit = 20;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const searchTerm = searchParams.get("search") || "";

    const invoices = useStaffInvoices({ startDate, endDate, limit, page, searchTerm });

    const activeInvoice = useMemo(() => {
        if (!selected || invoices.isLoading) return undefined;

        return invoices?.payload?.find((d) => d.id === selected)

    }, [selected, invoices])

    const handleCopyId = () => {
        if (!activeInvoice) return

        navigator.clipboard.writeText(activeInvoice.sku)
            .then(() => {
                toast({
                    title: "Copied Invoice ID",
                    description: ""
                })
            })
            .catch((error) => {
                console.error("Failed to copy ID:", error);
            });
    }

    function handleDeleteSucess() {
        queryClient.invalidateQueries({ queryKey: [INVOICE_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false });
    }

    const handleDelete = () => {
        if (activeInvoice)
            handlePostAxios({ values: { id: activeInvoice.id }, route: INVOICE_ROUTES.ADMIN.DELETE.URL, handleSuccess: handleDeleteSucess })
    }

    if (activeInvoice)
        return (
            <article className='w-full max-w-md'>
                <Card className='relative'>
                    <div className="flex justify-center items-center gap-1 absolute top-4 right-4">
                        <Button className='size-7 p-1.5' type='button' variant={"outline"} onClick={handleCopyId}>
                            <CopyIcon className={"size-full"} />
                        </Button>
                        <Button className='size-7 p-1.5' type='button' variant={"outline"}
                            onClick={handleDelete}>
                            <TrashIcon className={"size-full"} />
                        </Button>
                    </div>
                    <CardHeader>
                        <CardTitle>{activeInvoice.sku}</CardTitle>
                        <CardDescription>Sold by {activeInvoice.user.name}</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                        <ul className='space-y-3'>
                            {
                                activeInvoice.items.map((item) => {
                                    return (
                                        <li className="flex gap-4" key={item.id}>
                                            <div className="flex-1 flex flex-col">
                                                <h1 className="text-base font-medium">{item.item.name}</h1>
                                                <p className="text-sm text-muted-foreground">{item.quantity} x {formatPricingNumber(item.price)}</p>
                                                <div className="w-fit px-2 py-1 text-xs font-medium rounded-full border">
                                                    {item.item.category.name}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-end items-baseline">
                                                <h1 className="font-medium">{formatPricingNumber(item.quantity * item.price)}</h1>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <h1 className="">Total ({activeInvoice.items.length})</h1>
                            <h1 className="font-bold">{formatPricingNumber(activeInvoice.totalAmount)}</h1>
                        </div>
                    </CardContent>
                    <CardFooter className='flex-row justify-between items-center'>
                        <p className="text-xs text-muted-foreground">Created: {format(activeInvoice.createdAt, FORMAT)}</p>
                        <p className="text-xs text-muted-foreground">Last Updated: {format(activeInvoice.updatedAt, FORMAT)}</p>
                    </CardFooter>
                </Card>
            </article>
        )
}

export default InvoiceView