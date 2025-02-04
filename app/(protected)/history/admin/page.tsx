'use client'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { UiDatePickerRange } from '@/components/ui/date-range';
import useAdminHistory from '@/hooks/admin/use-history'
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, PlusIcon } from 'lucide-react';
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
import UiDataLoader from '@/components/ui/data-loader';
import { FORMAT, formatDateTime } from '@/lib/utils';
import UiSearch from '@/components/ui/search';
import UiPaginatedButtons from '@/components/ui/paginated-btns';
import UiCodeLabel from '@/components/ui-project/code-label';
import { AddModal } from './_components/add';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from '@/hooks/use-toast';


const HistoryAdminPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const startDate = startDateParam ? startOfMonth(new Date(startDateParam)) : startOfMonth(new Date());
    const endDate = endDateParam ? endOfMonth(new Date(endDateParam)) : endOfMonth(new Date());

    const data = useAdminHistory({ page, limit: 20, startDate, endDate, searchTerm: search });

    const handleExportHistory = () => {
        if (data.payload?.length === 0 || !data.payload) return;

        const csvContent = [
            ["Date Time", "User", "Region", "Province", "City", "Barangay", "Email", "Number", "Status"],
            ...data.payload.map((d: any) => [
                formatDateTime(d.date),
                `${d.user.fname} ${d.user.lname}`,
                d.user.regCode,
                d.user.provCode,
                d.user.citymunCode,
                d.user.brgyCode,
                d.user.user.email,
                d.user.user.contactNumber,
                d.user.status
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "history_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleExportContacts = async () => {
        toast({ description: "Please wait while we fetch your request..." })
        const ROUTE = "/api/contacts/export"
        const response = await fetch(
            `${ROUTE}?startDate=${format(startDate, FORMAT)}&endDate=${format(endDate, FORMAT)}`
        );
        console.log(response);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const csvContent = [
            ["Date Time", "User Infected", "Region", "Province", "City", "Barangay", "Contacts"],
            ...data.payload.map((d: any) => [
                formatDateTime(d.date),
                `${d.user.name}`,
                d.user.userProfile.regCode,
                d.user.userProfile.provCode,
                d.user.userProfile.citymunCode,
                d.user.userProfile.brgyCode,
                d.usersExposed.map((g: any) => (g.user.email)).join(", ")
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "contacts_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <article className="w-full p-4">
            <div className="flex justify-between items-center py-2">
                <div className="flex justify-start gap-2 items-center">
                    <UiSearch className='h-9 max-w-md' handleResetPage={() => { }} placeholder='Search name of user...' />
                    <UiDatePickerRange defaultStartDate={startDate} defaultEndDate={endDate} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type='button' variant={"outline"}>
                                <span>Export Data</span>
                                <DownloadIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleExportHistory}>History</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportContacts}>Contact List</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <AddModal /> */}
                </div>
                <UiPaginatedButtons hasPrev={page > 1} hasNext={page < (data.totalPages ?? 0)} />
            </div>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <UiDataLoader
                            isLoading={data.isLoading || data.isFetching}
                            length={data.payload?.length}
                            columns={6}
                            type='table'
                        >
                            {data.payload?.map((d) => {
                                return (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-medium">{formatDateTime(d.date)}</TableCell>
                                        <TableCell>{d.user.fname} {d.user.lname}</TableCell>
                                        <TableCell>
                                            {d.user.regCode}
                                            {/* <UiCodeLabel value={d.user.regCode} type="region" /> */}
                                        </TableCell>
                                        <TableCell>
                                            {d.user.provCode}
                                            {/* <UiCodeLabel value={d.user.provCode} type="province" /> */}
                                        </TableCell>
                                        <TableCell>
                                            {d.user.citymunCode}
                                            {/* <UiCodeLabel value={d.user.citymunCode} type="city" /> */}
                                        </TableCell>
                                        <TableCell>
                                            {d.user.brgyCode}
                                            {/* <UiCodeLabel value={d.user.brgyCode} type="barangay" /> */}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </UiDataLoader>
                    </TableBody>
                </Table>
            </div>
        </article>
    )
}

export default HistoryAdminPage