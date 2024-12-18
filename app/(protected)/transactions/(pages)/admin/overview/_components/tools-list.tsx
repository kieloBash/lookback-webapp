"use client"
import { Button } from '@/components/ui/button'
import useRevenue from '@/hooks/analytics/use-revenue'
import { FORMAT } from '@/lib/utils'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { DownloadIcon, ShareIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'

const ToolsList = () => {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const revenue = useRevenue({ startDate, endDate })
    const data = useMemo(() => {
        if (revenue.isLoading || !revenue?.revenueByDay) return [];
        return revenue.revenueByDay;
    }, [revenue])

    function handleDownload() {
        const csvContent = [
            ['Date', 'Revenue'],
            ...data.map(({ date, revenue }) => [date, revenue]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `revenue_report(${format(startDate, FORMAT)}_${format(endDate, FORMAT)}).csv`;
        link.click();

        URL.revokeObjectURL(url);
    }

    function handleShare() {

    }

    return (
        <ul className='flex justify-center items-center gap-1'>
            <li>
                <Button variant={"outline"} className='size-7 p-1 rounded-full' type='button' onClick={handleDownload}><DownloadIcon /></Button>
            </li>
            <li>
                <Button variant={"outline"} className='size-7 p-1 rounded-full' type='button' onClick={handleShare}><ShareIcon /></Button>
            </li>
        </ul>
    )
}

export default ToolsList