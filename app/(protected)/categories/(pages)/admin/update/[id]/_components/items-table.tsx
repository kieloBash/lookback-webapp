'use client'
import UiDataLoader from "@/components/ui/data-loader";
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
import useAdminCategoryId from "@/hooks/admin/use-categoryid"
import { formatPricingNumber } from "@/lib/utils";
import { useMemo } from "react";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

export function ItemsTable({ id }: { id: string }) {

    const category = useAdminCategoryId({ id });

    const total = useMemo(() => {
        if (category.isLoading || !category?.payload) return 0;

        return category.payload.items.reduce((acc, item) => {
            return acc + item.quantity;
        }, 0);
    }, [category])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[160px]">SKU</TableHead>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <UiDataLoader
                    columns={4}
                    length={category.payload?.items.length}
                    isLoading={category.isLoading || category.isFetching}
                    type="table"
                >
                    {category?.payload?.items?.map(({ id, sku, name, quantity, price, description }) => (
                        <TableRow key={id}>
                            <TableCell className="font-medium">{sku}</TableCell>
                            <TableCell>
                                <div className="grid">
                                    <h2 className="">{name}</h2>
                                    <p className="text-xs text-muted-foreground">{description}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">{formatPricingNumber(price)}</TableCell>
                            <TableCell className="text-right">{quantity}</TableCell>
                        </TableRow>
                    ))}
                </UiDataLoader>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">{total}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
