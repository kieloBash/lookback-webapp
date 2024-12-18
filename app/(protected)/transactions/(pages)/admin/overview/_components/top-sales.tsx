'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingTemplate from '@/components/ui/loading-page'
import UiCategoriesIcon from '@/components/ui/ui-categories-icon'
import useCategorySales from '@/hooks/analytics/use-category-sales'
import { formatPricingNumber } from '@/lib/utils'
import { endOfMonth, startOfMonth } from 'date-fns'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const TopSalesCard = () => {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const sales = useCategorySales({ startDate, endDate })

    if (sales.isLoading) return <LoadingTemplate />;

    return (
        <>
            <Card className='h-full w-full max-w-[14rem]'>
                <CardHeader className='pb-1'>
                    <h1 className='text-muted-foreground text-left font-bold text-sm'>Top Category Sales</h1>
                </CardHeader>
                <CardContent className='py-1'>
                    <h1 className="text-2xl font-bold">{formatPricingNumber(sales?.highestCategorySale?.price ?? 0)}</h1>
                </CardContent>
                <CardFooter className='flex-row justify-between items-center'>
                    <div className="flex justify-center gap-1 items-center py-1">
                        <span className="">
                            <UiCategoriesIcon icon={sales?.highestCategorySale?.icon ?? ""} className='size-4' />
                        </span>
                        <span className="text-sm font-medium">{sales?.highestCategorySale?.name} ({sales?.highestCategorySale?.quantity ?? 0})</span>
                    </div>
                    <Link href={`/categories/admin/item/${sales?.highestCategorySale?.id ?? ""}`}>
                        <Button type="button" variant={"secondary"} className='size-7 p-1'>
                            <ChevronRight />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
            <Card className='h-full w-full max-w-[14rem]'>
                <CardHeader className='pb-1'>
                    <h1 className='text-muted-foreground text-left font-bold text-sm'>Top Item Sales</h1>
                </CardHeader>
                <CardContent className='py-1'>
                    <h1 className="text-2xl font-bold">{formatPricingNumber(sales?.highestItemSale?.price ?? 0)}</h1>
                </CardContent>
                <CardFooter className='flex-row justify-between items-center'>
                    <div className="flex justify-center gap-1 items-center py-1">
                        <span className="text-sm font-medium">{sales?.highestItemSale?.name} ({sales?.highestItemSale?.quantity ?? 0})</span>
                    </div>
                    <Link href={`/categories/admin/item/${sales?.highestItemSale?.id ?? ""}`}>
                        <Button type="button" variant={"secondary"} className='size-7 p-1'>
                            <ChevronRight />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </>
    )
}

export default TopSalesCard