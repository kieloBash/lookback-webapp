import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface IProps {
    hasNext?: boolean;
    hasPrev?: boolean;
}

const UiPaginatedButtons = ({ hasNext = true, hasPrev = true }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);

    const handlePrev = () => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set("page", `${page - 1}`);

        router.push(`${pathname}?${currentParams.toString()}`);
    }

    const handleNext = () => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set("page", `${page + 1}`);

        router.push(`${pathname}?${currentParams.toString()}`);
    }

    return (
        <div className="flex gap-2">
            <Button disabled={!hasPrev} onClick={handlePrev} type='button' className='size-9' size={"icon"} variant={"outline"}><ChevronLeftIcon /></Button>
            <Button disabled={!hasNext} onClick={handleNext} type='button' className='size-9' size={"icon"} variant={"outline"}><ChevronRightIcon /></Button>
        </div>
    )
}

export default UiPaginatedButtons