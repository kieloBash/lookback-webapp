import UiCategoriesIcon from '@/components/ui/ui-categories-icon'
import useAdminCategories from '@/hooks/admin/use-categories'
import { Category } from '@prisma/client'
import clsx from 'clsx'
import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation';

const Item = ({ item, isActive, handleActiveChange }: { item: Category, isActive: boolean, handleActiveChange: (val: { id: string; label: string }) => void }) => {
    const className = clsx("size-16 rounded-md p-2 gap-1 border flex flex-col justify-center items-center transition-colors",
        isActive ? "bg-primary" : "hover:bg-primary"
    )
    return (
        <button className={className} type='button' onClick={() => handleActiveChange({ id: item.id, label: item.name })}>
            <UiCategoriesIcon icon={item.icon} />
            <p className="text-xs text-center">{item.name}</p>
        </button>
    )
}

const ItemCategoriesSelection = ({ handleActiveCategoryChange }: { handleActiveCategoryChange: (val: { id: string; label: string }) => void; }) => {
    const categories = useAdminCategories({});
    const searchParams = useSearchParams();

    const filter = searchParams.get("filter") || "all";

    return (
        <div className="flex flex-wrap justify-start items-start gap-2 w-full max-w-lg">
            {categories?.payload?.map((item) => (
                <Item
                    key={item.id}
                    item={item} handleActiveChange={handleActiveCategoryChange}
                    isActive={filter === item.id} />
            ))}
        </div>
    )
}

export default ItemCategoriesSelection