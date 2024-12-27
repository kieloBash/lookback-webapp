import React, { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAdminCategoriesList } from '@/hooks/admin/use-categories';
import useAdminInventory from '@/hooks/admin/use-inventory';
import LoadingTemplate from '@/components/ui/loading-page';
import MenuItem from './menu-item';
import { useFieldArray, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Item } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import UiSearch from '@/components/ui/search';
import useStaffInventory from '@/hooks/staff/use-inventory';

interface IProps {
    form: UseFormReturn<any, any, undefined>,
    fieldForm: UseFieldArrayReturn<any, "items", "id">
}

const ItemMenu = ({ form, fieldForm: { fields, append, remove, update } }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";

    const categories = useAdminCategoriesList();
    const activeCategory = useMemo(() => {
        return categories?.payload?.find((d) => d.id === filter)
    }, [categories.payload, filter])

    const inventory = useStaffInventory({ filter, limit: 12, page: currentPage, searchTerm: search })

    const handlePageChange = (newPage: number) => {
        const currentParams = new URLSearchParams(
            Array.from(searchParams.entries())
        );
        currentParams.set("page", `${newPage}`);
        router.push(`${pathname}?${currentParams.toString()}`);
    };

    const handlePrevPage = () => {
        if (currentPage - 1 > 0) {
            handlePageChange(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage + 1 <= (inventory?.totalPages ?? 0)) {
            handlePageChange(currentPage + 1)
        }
    }

    const handleOnChangeItem = ({ type, item }: { type: "add" | "remove"; item: Item }) => {
        if (type === "add") handleAddItem(item)
        else handleRemoveItem(item)
    }

    const handleAddItem = (item: Item) => {
        const existingIndex = fields.findIndex((d: any) => d.sku === item.sku);

        if (existingIndex !== -1) {
            if ((fields[existingIndex] as any).quantity + 1 <= item.quantity) {
                // If the item exists, increment its quantity using the `update` method
                const updatedItem = {
                    ...fields[existingIndex],
                    quantity: (fields[existingIndex] as any).quantity + 1,
                };
                update(existingIndex, updatedItem);
            }
        } else {
            append({
                itemId: item.id,
                sku: item.sku,
                name: item.name,
                category: item.categoryId,
                quantity: 1, // Initial quantity
                price: item.price,
            });
        }
    };

    const handleRemoveItem = (item: Item) => {
        const existingIndex = fields.findIndex((d: any) => d.sku === item.sku);

        if (existingIndex !== -1) {

            const checker = (fields[existingIndex] as any).quantity > 1

            if (checker) {
                if ((fields[existingIndex] as any).quantity - 1 >= 0) {
                    const updatedItem = {
                        ...fields[existingIndex],
                        quantity: (fields[existingIndex] as any).quantity - 1,
                    };
                    update(existingIndex, updatedItem);
                }
            } else {
                remove(existingIndex)
            }

        }
    }

    if (categories.isLoading || inventory.isLoading) return <LoadingTemplate />

    return (
        <div className="flex flex-col gap-4 w-full mt-2">
            <div className="flex justify-start items-center gap-2">
                <h2 className="text-3xl">{activeCategory?.label ?? "All Items"} <span className='text-2xl'>({inventory?.totalData ?? 0})</span></h2>
                <div className="flex justify-center items-center gap-1">
                    <Button onClick={handlePrevPage} type="button" variant={"outline"} className='size-7 p-1'>
                        <ChevronLeft />
                    </Button>
                    <Button onClick={handleNextPage} type="button" variant={"outline"} className='size-7 p-1'>
                        <ChevronRight />
                    </Button>
                </div>
                <div className="flex-1 flex justify-end items-center">
                    <UiSearch
                        className='max-w-sm'
                        placeholder='Search for names...'
                        handleResetPage={() => { }}
                    />
                </div>
            </div>
            {inventory?.isFetching || inventory.isLoading ? <LoadingTemplate /> :
                <>
                    {(inventory?.payload?.length ?? 0) > 0 ? <>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                            {inventory?.payload?.map((item) => {
                                const existingInvoice = fields.find((d: any) => d.sku === item.sku) as any
                                return <MenuItem key={item.id} item={item} onChange={handleOnChangeItem} quantity={existingInvoice?.quantity ?? 0} />
                            })}
                        </div>
                    </> :
                        <div className="size-full flex justify-center items-center">
                            <h1 className="text-muted-foreground">No Items Found</h1>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default ItemMenu