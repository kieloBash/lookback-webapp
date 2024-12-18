import React, { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAdminCategoriesList } from '@/hooks/admin/use-categories';
import useAdminInventory from '@/hooks/admin/use-inventory';
import LoadingTemplate from '@/components/ui/loading-page';
import MenuItem from './menu-item';
import { useFieldArray, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Item } from '@prisma/client';

interface IProps {
    form: UseFormReturn<any, any, undefined>,
    fieldForm: UseFieldArrayReturn<any, "items", "id">
}

const ItemMenu = ({ form, fieldForm: { fields, append, remove, update } }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const filter = searchParams.get("filter") || "all";

    const categories = useAdminCategoriesList();
    const activeCategory = useMemo(() => {
        return categories?.payload?.find((d) => d.id === filter)
    }, [categories.payload, filter])

    const inventory = useAdminInventory({ filter })

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
            <h2 className="text-3xl">{activeCategory?.label ?? "All Items"}</h2>
            {inventory?.isFetching || inventory.isLoading ? <LoadingTemplate /> :
                <div className="flex-1 grid grid-cols-3 gap-2">
                    {inventory?.payload?.map((item) => {

                        const existingInvoice = fields.find((d: any) => d.sku === item.sku) as any


                        return <MenuItem key={item.id} item={item} onChange={handleOnChangeItem} quantity={existingInvoice?.quantity ?? 0} />
                    })}
                </div>
            }
        </div>
    )
}

export default ItemMenu