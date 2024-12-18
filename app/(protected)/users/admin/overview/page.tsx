'use client'
import { Button } from "@/components/ui/button"
import UiDataLoader from "@/components/ui/data-loader"
import UiSearch from "@/components/ui/search"
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
import useAdminSellers from "@/hooks/admin/use-sellers"
import { PenBoxIcon, TrashIcon } from "lucide-react"
import Link from "next/link"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import RowItem from "./_components/row-item"

export default function AdminUsersOverview() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";

    const users = useAdminSellers({ filter, page, searchTerm: search });

    if (users.isError) return <div className="">An error occured</div>

    return (
        <section className="size-full p-4 space-y-3">
            <div className="flex justify-between items-center">
                <UiSearch
                    placeholder="Search name or email"
                    className="max-w-md"
                    handleResetPage={() => { }}
                />
                <Link href={"/users/admin/create"}>
                    <Button>Create User</Button>
                </Link>
            </div>
            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <UiDataLoader
                        isError={users?.isError}
                        isLoading={users?.isLoading || users?.isFetching}
                        length={users?.payload?.length}
                        type="table"
                        columns={4}
                    >
                        {users?.payload?.map((data) => (
                            <RowItem key={data.id} data={data} />
                        ))}
                    </UiDataLoader>
                </TableBody>
                <TableFooter>
                    <TableRow>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    )
}
