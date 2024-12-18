'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useDebounce from '@/lib/hooks';
import { Search, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IProps {
    placeholder?: string
    className?: string
    handleResetPage: () => void
}

const UiSearch = ({ placeholder = "Search...", className, handleResetPage }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(search);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const CLASSNAME = cn(
        "flex items-center border bg-background rounded-md px-3 w-full",
        className,
    );

    useEffect(() => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set("search", debouncedSearchTerm);
        currentParams.set("page", "1");
        handleResetPage();

        router.push(`${pathname}?${currentParams.toString()}`);
    }, [debouncedSearchTerm]);

    return (
        <div className={CLASSNAME}>
            <Search className="mr-2 size-4 shrink-0 opacity-50" />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={"flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"}
            />
            {searchTerm && <button type='button' className='size-4 shrink-0 opacity-50' onClick={() => { handleResetPage(); setSearchTerm("") }}><XIcon className="size-full" /></button>}
        </div>
    )
}

export default UiSearch
