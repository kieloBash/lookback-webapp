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

const ManagementHistoryPage = () => {
    const data = useManagementHistory({});
    return (
        <section className="w-full h-full p-4 flex justify-start items-center flex-col">
            <div className="w-full lg:max-w-none max-w-xs">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[170px]">Date Time</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Province</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Barangay</TableHead>
                            <TableHead className='text-right'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.payload?.map((d) => {
                            return (
                                <TableRow key={d.id}>
                                    <TableCell className="font-medium">{formatDateTime(d.date)}</TableCell>
                                    <TableCell>{d.user.fname} {d.user.lname}</TableCell>
                                    <TableCell>{d.user.regCode}</TableCell>
                                    <TableCell>{d.user.provCode}</TableCell>
                                    <TableCell>{d.user.citymunCode}</TableCell>
                                    <TableCell>{d.user.brgyCode}</TableCell>
                                    <TableCell className="text-right">{d.user.status}</TableCell>
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