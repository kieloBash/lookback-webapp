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
import { useMemo } from "react"

interface IProps {
    items: any[]
}

export function ItemsTable({ items }: IProps) {
    const total = useMemo(() => {
        return items.reduce((acc, item) => acc + item.totalAmount, 0);
    }, [items])
    return (
        <Table>
            <TableCaption>
                List of items in transaction
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reorder</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => {
                    return (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.categoryLabel}</TableCell>
                            <TableCell>{item.reorderLevel}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{((item.totalAmount).toLocaleString())}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={5}>Total ({items.length})</TableCell>
                    <TableCell className="text-right">{total.toLocaleString()}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
