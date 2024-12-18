'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UiDatePickerRange } from '@/components/ui/date-range'
import LoadingTemplate from '@/components/ui/loading-page'
import useRevenue from '@/hooks/analytics/use-revenue'
import { formatPricingNumber } from '@/lib/utils'
import { endOfMonth, startOfMonth } from 'date-fns'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const RevenueCard = () => {

    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const revenue = useRevenue({ startDate, endDate });

    if (revenue.isLoading) return <LoadingTemplate />

    return (
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent className='flex gap-2 justify-start items-baseline pb-3'>
                <h1 className="text-4xl font-bold">{formatPricingNumber(revenue?.currentTotalRevenue ?? 0)}</h1>
                <div className="text-xs px-2 py-1 rounded-full border bg-primary text-primary-foreground flex justify-center items-center gap-0.5">
                    {revenue?.status === "positive" ?
                        <ArrowUpIcon className='size-3' />
                        :
                        <ArrowDownIcon className='size-3' />
                    }
                    <span className='font-medium'>{formatPricingNumber(revenue?.percentageDifference ?? 0)}%</span>
                </div>
                <div className="text-xs px-2 py-1 rounded-full border bg-primary text-primary-foreground flex justify-center items-center gap-0.5">
                    {revenue?.status === "positive" ?
                        <PlusIcon className='size-3' />
                        :
                        <MinusIcon className='size-3' />
                    }
                    <span className='font-medium'>{formatPricingNumber(revenue?.totalDifference ?? 0)}</span>
                </div>
            </CardContent>
            <CardFooter className='flex-row gap-2'>
                <p className="text-sm">vs. prev. <span className="font-bold">{formatPricingNumber(revenue?.previousTotalRevenue ?? 0)}</span></p>
                <UiDatePickerRange />
            </CardFooter>
        </Card>
    )
}

export default RevenueCard