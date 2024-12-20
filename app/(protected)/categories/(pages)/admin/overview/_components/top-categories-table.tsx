'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UiDataLoader from "@/components/ui/data-loader";
import UiSearch from "@/components/ui/search";
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
import UiCategoriesIcon from "@/components/ui/ui-categories-icon";
import useAdminCategories from "@/hooks/admin/use-categories"
import { handlePostAxios } from "@/lib/utils";
import { CATEGORIES_ROUTES } from "@/routes/categories.routes";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function TopCategoriesTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1", 10);
    const searchTerm = searchParams.get("search") || "";
    const categories = useAdminCategories({ limit: 5, page, searchTerm });

    const queryClient = useQueryClient();
    const handleSuccessDelete = () => {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
    }

    const handleDeleteCategory = async (id: string) => {
        await handlePostAxios({ values: { id }, route: CATEGORIES_ROUTES.ADMIN.DELETE.URL, handleSuccess: handleSuccessDelete })
    }

    const handlePageChange = (newPage: number) => {
        const currentParams = new URLSearchParams(
            Array.from(searchParams.entries())
        );
        currentParams.set("page", `${newPage}`);
        router.push(`${pathname}?${currentParams.toString()}`);
    };

    const handlePrevPage = () => {
        if (page - 1 > 0) {
            handlePageChange(page - 1)
        }
    }

    const handleNextPage = () => {
        if (page + 1 <= (categories?.totalPages ?? 0)) {
            handlePageChange(page + 1)
        }
    }

    if (categories.isError) return <div>An error occured</div>

    return (
        <article className="w-full">
            <Card>
                <CardHeader className="pb-2 flex-row justify-between items-center">
                    <CardTitle>
                        List of Categories
                    </CardTitle>
                    <UiSearch className="max-w-xs" handleResetPage={() => { }} placeholder="Search by name..." />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <UiDataLoader
                                type="table"
                                columns={4}
                                length={categories.payload?.length}
                                isLoading={categories.isLoading || categories.isFetching}
                            >
                                {
                                    categories?.payload?.map((item) => {
                                        const total = item.items.reduce((acc, i) => acc + i.quantity, 0);
                                        return (
                                            <TableRow key={item.id} onClick={() => router.push(`/categories/admin/view/${item.id}`)} className="cursor-pointer">
                                                <TableCell>
                                                    <div className="size-14 relative bg-muted rounded flex justify-center items-center">
                                                        <UiCategoriesIcon icon={item.icon} />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="w-full py-3" colSpan={2}>
                                                    <div className="flex flex-col justify-between items-start">
                                                        <h1 className="text-xl font-medium">{item.name}</h1>
                                                        <ul className="flex flex-wrap justify-start items-start gap-1">
                                                            {item.items.length > 0 ? <>
                                                                {
                                                                    item.items.map((d) => (
                                                                        <div className="bg-secondary text-xs rounded-full px-2 py-1 border" key={d.id}>
                                                                            <span>{d.name} ({d.quantity})</span>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </> : <li><p className="">No items found</p></li>}
                                                        </ul>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col justify-between items-end">
                                                        <h1 className="text-lg font-medium text-nowrap text-right">{total} stocks</h1>
                                                        <div className="flex gap-1 items-center justify-center">
                                                            <Link href={`/categories/admin/update/${item.id}`}>
                                                                <Button type="button" className="size-7 p-1 z-10" variant={"outline"} onClick={(e) => e.stopPropagation()}><EditIcon /></Button>
                                                            </Link>
                                                            <Button type="button" className="size-7 p-1 z-10" variant={"outline"} onClick={(e) => {
                                                                handleDeleteCategory(item.id);
                                                                e.stopPropagation()
                                                            }}><Trash2Icon /></Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </UiDataLoader>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} className="">
                                    <div className="w-full flex justify-between items-center gap-1">
                                        <Link href={"/categories/admin/create"}>
                                            <Button type="button" size={"sm"} variant={"secondary"}>New Category</Button>
                                        </Link>
                                        <div className="flex gap-1">
                                            <Button onClick={handlePrevPage} type="button" variant={"outline"} className="size-7 rounded-full p-1">
                                                <ChevronLeft className="size-full" />
                                            </Button>
                                            <Button onClick={handleNextPage} type="button" variant={"outline"} className="size-7 rounded-full p-1">
                                                <ChevronRight className="size-full" />
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </article>
    )
}
