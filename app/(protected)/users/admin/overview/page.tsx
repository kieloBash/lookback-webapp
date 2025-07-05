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
    const status = searchParams.get("statusFilter") || role === UserRole.ADMIN ? "USER" : "ALL";
    const search = searchParams.get("search") || "";

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

    // const handleChangeStatus = async () => {
    //     if (action !== "change-status-negative" && action !== "change-status-positive") return null;

    //     setIsLoading(true)
    //     setLoadingMessage("processing request...")
    //     const url = action === "change-status-positive" ? `${REQUESTS_ROUTES.ADMIN.UPDATE.URL}/accept` : `${REQUESTS_ROUTES.ADMIN.UPDATE.URL}/deny`;

    //     try {
    //         toast({ title: "Please wait...", description: "We are currently processing your request." })
    //         sleep(2000);


    //     } catch (error) {



    //     } finally {
    //         setIsLoading(false)
    //     }

    // }

    // const handleUpdateToPositive = async ({ url, userId }: { url: string, userId: string }) => {

    //     toast({ description: `Finding histories and affected users...` });
    //     const res1 = await axios.post(`${url}/user-history`, { newStatus: "QUALIFIED", id });
    //     console.log(res1.data);

    //     const user_histories = res1.data.values.histories;
    //     setLoadingMessage(`Please wait, we found ${user_histories.length} history of the user.`)

    //     const res2 = await axios.post(`${url}/related-history`, { user_histories });
    //     console.log(res2.data);
    //     const affectedUsers = res2.data.values.affectedUsers

    //     const userIds: string[] = affectedUsers
    //         .map((u: any) => {
    //             if (u.userProfile.status === "NEGATIVE") {
    //                 console.log(u);
    //                 return u.id;
    //             }
    //         })
    //         .filter((d: any) => d !== undefined);

    //     setLoadingMessage(`We found ${userIds.length} affected users to also be processed.`)
    //     await sleep(1000);
    //     console.log(userIds)

    //     if (userIds.length > 0) {
    //         setLoadingMessage(`Sending notifications to affected users...`)

    //         const res3 = await axios.post(`${url}/notify`, { userIds, diagnosedId: user_histories[0].userId });
    //         console.log(res3);

    //         setLoadingMessage(`Making contact tracing record...`)

    //         const res4 = await axios.post(`${url}/contact-tracing`, { userIds, diagnosedId: user_histories[0].userId, dateOfTesting: d.dateOfTesting });
    //         console.log(res4);
    //     } else {
    //         setLoadingMessage(`There were no affected users detected from the system.`)
    //         toast({ title: "No Affected Users", description: `There were no affected users detected from the system.` });
    //     }

    //     await sleep(2000);

    //     setLoadingMessage(`Updating request...`)
    //     const res5 = await axios.post(`${url}/last`, { requestId: d.id, userId: user_histories[0].userId, dateOfTesting: d.dateOfTesting });
    //     console.log(res5);

    //     setLoadingMessage(`Success!`)
    //     toast({ description: "Success!" });
    // }

    // const handleResetStatus = async () => {
    //     await handleAxios({ values: {}, url: "/api/users/admin/update/reset" })
    //         .then((res) => {
    //             queryClient.invalidateQueries({ queryKey: [USERS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
    //         })
    //         .catch((e) => {
    //             toast({ description: e.response });
    //         })
    // }

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