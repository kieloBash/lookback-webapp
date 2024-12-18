"use client"
import React from 'react'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from '@/lib/utils';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface IProps {
    totalPages: number;
    currentPage: number;
    maxVisiblePages?: number
}

const UiTablePaginations = ({ maxVisiblePages = 3, totalPages, currentPage }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const currentParams = new URLSearchParams(
            Array.from(searchParams.entries())
        );
        currentParams.set("page", `${newPage}`);
        router.push(`${pathname}?${currentParams.toString()}`);
    };

    const handlePrevPage = () => {
        if (currentPage - 1 > 0) {
            handlePageChange(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage + 1 <= totalPages) {
            handlePageChange(currentPage + 1)
        }
    }

    return (
        <div className="">
            <Pagination>
                <PaginationContent>
                    {totalPages > 1 && (
                        <PaginationItem>
                            <PaginationPrevious size={"sm"} onClick={handlePrevPage} />
                        </PaginationItem>
                    )}
                    {Array.from({ length: Math.min(maxVisiblePages, totalPages) })
                        .map((_, idx) => {
                            const startPage = Math.max(
                                1,
                                Math.min(
                                    totalPages - maxVisiblePages + 1,
                                    currentPage - Math.floor(maxVisiblePages / 2)
                                )
                            );

                            const pageNumber = startPage + idx;

                            const activeClassName = cn("",
                                currentPage === pageNumber ? "bg-primary/30 hover:bg-primary/60" : ""
                            )

                            return (
                                <PaginationItem key={`${idx}-pagination`}>
                                    <PaginationLink className={activeClassName} size={"sm"} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</PaginationLink>
                                </PaginationItem>
                            )
                        })
                    }
                    {totalPages > 1 && (
                        <PaginationItem>
                            <PaginationNext size={"sm"} onClick={handleNextPage} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default UiTablePaginations