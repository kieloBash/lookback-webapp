import UiDataLoader from "@/components/ui/data-loader";
import UiReorderStocks from "@/components/ui/display-reorder";
import UiSearch from "@/components/ui/search";
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
import useAdminInventory from "@/hooks/admin/use-inventory";
import { cn, formatPricingNumber } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface IProps {
    selected: string;
    onChange: (val: string) => void;
}

export function ItemExistingTable({ selected, onChange }: IProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";

    const inventory = useAdminInventory({ filter, page, limit: 10, searchTerm: search })

    return (
        <div className="w-full flex flex-col gap-2">
            <UiSearch
                className="max-w-lg"
                placeholder="Search name or SKU..."
                handleResetPage={() => { }}
            />
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
                <TableBody className="w-full">
                    {inventory?.payload?.map(({ id, sku, name, quantity, price, reorderLevel }) => {
                        const activeClassName = cn("w-full", selected === id ? "bg-primary/30 hover:bg-primary/30" : "hover:bg-muted")
                        return (
                            <TableRow className={activeClassName} key={id} onClick={() => {
                                if (selected === id) {
                                    onChange("")
                                } else {
                                    onChange(id)
                                }
                            }}>
                                <TableCell className="font-medium">{sku}</TableCell>
                                <TableCell>{name}</TableCell>
                                <TableCell>{formatPricingNumber(price)}</TableCell>
                                <TableCell className="text-right"><UiReorderStocks restock={reorderLevel} stock={quantity} /></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total ({inventory?.totalData ?? 0})</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4}>
                            <UiTablePaginations
                                totalPages={inventory?.totalPages ?? 0}
                                currentPage={page}
                            />
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}
