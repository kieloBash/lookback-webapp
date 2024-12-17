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
import useAdminInventory from "@/hooks/admin/use-inventory";
import { formatPricingNumber } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';



export function ItemExistingTable() {

    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const filter = searchParams.get("filter") || "all";

    const inventory = useAdminInventory({ filter })

    return (
        <Table className="w-full max-w-lg">
            <TableCaption>A list of items in {filter === "all" ? "all" : ""}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[155px]">SKU</TableHead>
                    <TableHead className="w-[220px]">Name</TableHead>
                    <TableHead className="">Price</TableHead>
                    <TableHead className="text-right">Stocks</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {inventory?.payload?.map(({ id, sku, name, quantity, price }) => (
                    <TableRow key={id}>
                        <TableCell className="font-medium">{sku}</TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>{formatPricingNumber(price)}</TableCell>
                        <TableCell className="text-right">{quantity}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total ({inventory?.totalData ?? 0})</TableCell>
                    <TableCell className="text-right"></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
