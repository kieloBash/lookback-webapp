'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import UiTablePaginations from "@/components/ui/table-paginations";
import useAdminInvoices from "@/hooks/admin/use-invoices"
import { cn, FORMAT, formatPricingNumber } from "@/lib/utils";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { useSearchParams } from "next/navigation";

interface IProps {
    selected: string;
    onChangeSelected: (val: string) => void;
}
export function InvoicesTable({ onChangeSelected, selected }: IProps) {

    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const limit = 20;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const searchTerm = searchParams.get("search") || "";

    const invoices = useAdminInvoices({ startDate, endDate, limit, page, searchTerm });
    return (
        <Card>
            <CardContent className="mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead className="w-[100px]">Seller</TableHead>
                            <TableHead className="">Items</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices?.payload?.map((item) => {
                            const activeClassName = cn("", selected === item.id && "bg-muted hover:bg-muted")
                            return (
                                <TableRow className={activeClassName} key={item.id} onClick={() => onChangeSelected(item.id)}>
                                    <TableCell className="font-medium">{format(new Date(item.createdAt), FORMAT)}</TableCell>
                                    <TableCell>{item.user.name}</TableCell>
                                    <TableCell className="flex flex-wrap justify-start items-start gap-1">
                                        {
                                            item.items.map((d) => {
                                                return (
                                                    <div className="border px-2 py-1 rounded-full text-xs" key={d.id}>
                                                        <span>{d.quantity}</span> x <span>{d.item.name}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </TableCell>
                                    <TableCell className="text-right font-bold">{formatPricingNumber(item.totalAmount)}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex-row justify-between items-center">
                <p className="text-xs text-muted-foreground">{((page * limit) - limit) + (invoices?.payload?.length ?? 0)} of {invoices?.totalData ?? 0} Results</p>
                <UiTablePaginations
                    currentPage={page}
                    totalPages={invoices?.totalPages ?? 0}
                />
            </CardFooter>
        </Card>
    )
}
