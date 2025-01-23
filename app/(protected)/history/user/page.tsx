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
import { formatDateTime } from '@/lib/utils'
import useUserHistory from '@/hooks/user/use-history'
import UiCodeLabel from '@/components/ui-project/code-label';

const UserHistoryPage = () => {
    const data = useUserHistory({});
    return (
        <section className="w-full h-full p-4 flex justify-start items-center flex-col">
            <div className="w-full lg:max-w-none max-w-xs">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[170px]">Date Time</TableHead>
                            <TableHead>Management</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Province</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Barangay</TableHead>
                            {/* <TableHead className='text-right'>No Covid Days</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.payload?.map((d) => {
                            return (
                                <TableRow key={d.id}>
                                    <TableCell className="font-medium">{formatDateTime(d.date)}</TableCell>
                                    <TableCell>{d.management.user.name}</TableCell>
                                    <TableCell>
                                        <UiCodeLabel value={d.management.regCode} type="region" />
                                    </TableCell>
                                    <TableCell>
                                        <UiCodeLabel value={d.management.provCode} type="province" />
                                    </TableCell>
                                    <TableCell>
                                        <UiCodeLabel value={d.management.citymunCode} type="city" />
                                    </TableCell>
                                    <TableCell>
                                        <UiCodeLabel value={d.management.brgyCode} type="barangay" />
                                    </TableCell>
                                    {/* <TableCell className="text-right">{d.management.daysWithoutCovid}</TableCell> */}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default UserHistoryPage