'use client'
import React from 'react'

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useAdminRequests from '@/hooks/admin/use-requests'
import UiDataLoader from '@/components/ui/data-loader'
import Row from './_components/row'


const RequestsAdminPage = () => {
    const data = useAdminRequests({});
    return (
        <section className="w-full h-full p-4 flex justify-start items-center flex-col">
            <div className="w-full lg:max-w-none max-w-xs">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">User</TableHead>
                            <TableHead className="w-[140px]">Date of Symptoms</TableHead>
                            <TableHead className="w-[140px]">Date of Testing</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead className=''>Medical</TableHead>
                            <TableHead className="w-[320px]">Symptoms</TableHead>
                            <TableHead className='text-right'>Status</TableHead>
                            <TableHead className='text-right'></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <UiDataLoader
                            isLoading={data.isLoading}
                            columns={8}
                            type="table"
                            length={data.payload?.length}
                        >
                            {data.payload?.map((d) => {
                                return (
                                    <Row data={d} key={d.id} />
                                )
                            })}
                        </UiDataLoader>
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default RequestsAdminPage