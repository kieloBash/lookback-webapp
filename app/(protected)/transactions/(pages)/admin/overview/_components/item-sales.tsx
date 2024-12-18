'use client'
import React from 'react'
import LoadingTemplate from '@/components/ui/loading-page';
import useCategorySales from '@/hooks/analytics/use-category-sales';
import { useSearchParams } from 'next/navigation';
import { formatPricingNumber } from '@/lib/utils'
import { endOfMonth, startOfMonth } from 'date-fns'
import UiCategoriesIcon from '@/components/ui/ui-categories-icon';

const ItemSales = () => {

    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const sales = useCategorySales({ startDate, endDate })

    if (sales.isLoading) return <LoadingTemplate />;

    return (
        <div className="w-full max-w-6xl overflow-x-auto overflow-y-hidden relative">
            <ul className="flex justify-start items-center gap-2 flex-nowrap">
                {sales.itemSales?.map((item) => (
                    <li
                        className="shadow text-xs flex justify-center items-center gap-1 rounded-full border px-2 py-1 h-7"
                        key={item.id}
                    >
                        <p className='text-nowrap'>{item.name} ({item.quantity})</p>
                        <span> - </span>
                        <p className="font-semibold">{formatPricingNumber(item.price)}</p>
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default ItemSales