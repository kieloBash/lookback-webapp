import UiCategoriesIcon from '@/components/ui/ui-categories-icon';
import useAdminCategories from '@/hooks/admin/use-categories';
import { Category } from '@prisma/client';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const ItemCategoriesSelection = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const filter = searchParams.get("filter") || "all";
    const categories = useAdminCategories({});

    const handleChangeCategory = (newVal: string | undefined) => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set("filter", newVal ? newVal : "all");

        router.push(`${pathname}?${currentParams.toString()}`);
    }


    return (
        <div className="flex flex-wrap justify-start items-start gap-2 w-full">
            {categories?.payload?.map((item) => (
                <Item
                    key={item.id}
                    item={item}
                    handleChange={handleChangeCategory}
                    isActive={filter === item.id} />
            ))}
        </div>
    )
}

export default ItemCategoriesSelection

const Item = ({ item, isActive, handleChange }:
    {
        item: Category,
        isActive: boolean;
        handleChange: (val: string | undefined) => void
    }
) => {
    const className = clsx("size-16 rounded-md p-2 gap-1 border flex flex-col justify-center items-center transition-colors",
        isActive ? "bg-primary" : "hover:bg-primary"
    )
    return (
        <button className={className} type='button' onClick={() => handleChange(isActive ? undefined : item.id)}>
            <UiCategoriesIcon icon={item.icon} />
            <p className="text-xs text-center">{item.name}</p>
        </button>
    )
}