'use client'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { UiDatePickerRange } from '@/components/ui/date-range';
import useAdminHistory from '@/hooks/admin/use-history'
import { endOfMonth, startOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from 'lucide-react';
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
import { formatDateTime } from '@/lib/utils';
import UiSearch from '@/components/ui/search';
import UiPaginatedButtons from '@/components/ui/paginated-btns';
import UiCodeLabel from '@/components/ui-project/code-label';

const HistoryAdminPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const startDate = startDateParam ? startOfMonth(new Date(startDateParam)) : startOfMonth(new Date());
    const endDate = endDateParam ? endOfMonth(new Date(endDateParam)) : endOfMonth(new Date());

    const data = useAdminHistory({ page, limit: 20, startDate, endDate, searchTerm: search });

    const handleExport = () => {
        if (data.payload?.length === 0 || !data.payload) return;

        const csvContent = [
            ["Date Time", "User", "Region", "Province", "City", "Barangay"],
            ...data.payload.map(d => [
                formatDateTime(d.date),
                `${d.user.fname} ${d.user.lname}`,
                d.user.regCode,
                d.user.provCode,
                d.user.citymunCode,
                d.user.brgyCode
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

    return (
        <article className="w-full p-4">
            <div className="flex justify-between items-center py-2">
                <div className="flex justify-start gap-2 items-center">
                    <UiSearch className='h-9 max-w-md' handleResetPage={() => { }} placeholder='Search name of user...' />
                    <UiDatePickerRange defaultStartDate={startDate} defaultEndDate={endDate} />
                    <Button onClick={handleExport} type='button' variant={"outline"}>
                        <span>Export Data</span>
                        <DownloadIcon />
                    </Button>
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