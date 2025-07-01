'use client'
import React from 'react'

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
import useManagementHistory from '@/hooks/management/use-history'
import { formatDateTime } from '@/lib/utils'
import UiCodeLabel from '@/components/ui-project/code-label';
import { useSearchParams } from 'next/navigation'
import { endOfMonth, startOfMonth } from 'date-fns'
import { UiDatePickerRange } from '@/components/ui/date-range'
import UiLoading from '@/components/ui/loading-page'

const ManagementHistoryPage = () => {
    const searchParams = useSearchParams();


    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const startDate = startDateParam ? startOfMonth(new Date(startDateParam)) : startOfMonth(new Date());
    const endDate = endDateParam ? endOfMonth(new Date(endDateParam)) : endOfMonth(new Date());


    const data = useManagementHistory({ startDate, endDate, });

    if (data.isLoading || data.isFetching) {
        return <UiLoading type='page' />
    }

    return (
        <section className="w-full h-full p-4 flex justify-start items-center flex-col">
            <div className="w-full flex justify-start items-center py-2">
                <div className="flex justify-start gap-2 items-start">
                    <UiDatePickerRange defaultStartDate={startDate} defaultEndDate={endDate} />
                </div>
            </div>
            <div className="w-full lg:max-w-none max-w-xs">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[170px]">Date Time</TableHead>
                            {/* <TableHead>User</TableHead> */}
                            <TableHead>Region</TableHead>
                            <TableHead>Province</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Barangay</TableHead>
                            {/* <TableHead className='text-right'>Status</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.payload?.map((d) => {
                            return (
                                <TableRow key={d.id}>
                                    <TableCell className="font-medium">{formatDateTime(d.date)}</TableCell>
                                    {/* <TableCell>{d.user.fname} {d.user.lname}</TableCell> */}
                                    <TableCell>
                                        <UiCodeLabel value={d.user.regCode} type="region" />
                                    </TableCell>
                                    <TableCell>
                                        <UiCodeLabel value={d.user.provCode} type="province" />
                                    </TableCell>
                                    <TableCell>
                                        <UiCodeLabel value={d.user.citymunCode} type="city" />
                                    </TableCell>
                                    <TableCell>
                                        <UiCodeLabel value={d.user.brgyCode} type="barangay" />
                                    </TableCell>
                                    {/* <TableCell className="text-right">{d.user.status}</TableCell> */}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default ManagementHistoryPage