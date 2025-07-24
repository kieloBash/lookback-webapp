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
import StatusFilter from './_components/filtter-status'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { handleAxios } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { USERS_ROUTES } from '@/routes/users.routes'
import UiSearch from '@/components/ui/search'
import { useCurrentRole } from '@/lib/hooks'
import { UserRole } from '@prisma/client'
import MainLoadingPage from '@/components/main-loading'
import UiLoading from '@/components/ui/loading-page'
import { REQUESTS_ROUTES } from '@/routes/requests.routes'
import axios from 'axios'
import CovidUpdateModal from './_components/modals/covid-update'


const AdminOverviewPage = () => {
    const role = useCurrentRole();
    const searchParams = useSearchParams();
    const status = role === UserRole.ADMIN ? "USER" : searchParams.get("statusFilter") ?? "ALL";
    const search = searchParams.get("search") || "";

    console.log({ status })

    const data = useAdminUsers({ filter: status, searchTerm: search });
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

    if (data.isLoading) {
        return <UiLoading type='page' />
    }

    return (
        <section className="w-full h-full p-4 flex justify-start items-center flex-col">
            {selectedData && action === "delete" &&
                <DeleteModal
                    data={selectedData}
                    open={selectedData && action === "delete"}
                    setOpen={handleReset}
                />}

            {selectedData && action === "change-status-positive" &&
                <CovidUpdateModal
                    open={selectedData && action === "change-status-positive"}
                    setOpen={handleReset}
                    contactData={selectedData}
                />}

            <div className="w-full flex justify-between items-center py-2 gap-2">
                <UiSearch className='h-9 max-w-md' handleResetPage={() => { }} placeholder='Search name of user...' />
                {role !== UserRole.ADMIN && (
                    <StatusFilter />
                )}
                {/* <Button type='button' size={"sm"} onClick={handleResetStatus}>Reset Status Users</Button> */}
            </div>
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
                            isLoading={data.isLoading || data.isFetching}
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