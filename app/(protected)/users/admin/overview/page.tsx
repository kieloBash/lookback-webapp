'use client'
import React, { useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useAdminUsers from '@/hooks/admin/use-users'
import UiDataLoader from '@/components/ui/data-loader'
import Row from './_components/row'
import { IActionType } from '@/types/global'
import { DeleteModal } from './_components/modals/delete'


const AdminOverviewPage = () => {
    const data = useAdminUsers({});
    const [selectedData, setSelectedData] = useState<any>(undefined);
    const [action, setAction] = useState<IActionType>("");

    const handleAction = (data: any, action: IActionType) => {
        setSelectedData(data);
        setAction(action);
    }

    const handleReset = (e: boolean) => {
        if (e) return null;

        setSelectedData(undefined);
        setAction("");
    }

    return (
        <section className="w-full h-full p-4 flex justify-start items-center flex-col">
            {selectedData && action === "delete" &&
                <DeleteModal
                    data={selectedData}
                    open={selectedData && action === "delete"}
                    setOpen={handleReset}
                />}
            <div className="w-full lg:max-w-none max-w-xs">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Role</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <UiDataLoader
                            isLoading={data.isLoading}
                            length={data.payload?.length}
                            type='table'
                            columns={4}
                        >
                            {data.payload?.map((d) => {
                                return (
                                    <Row data={d}
                                        key={d.id}
                                        handleAction={handleAction}
                                    />
                                )
                            })}
                        </UiDataLoader>
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default AdminOverviewPage