'use client'
import React, { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCurrentRole } from '@/lib/hooks';
import { UserRole } from '@prisma/client';


interface IProps {
    className?: string
}

const StatusFilter = ({ className }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const role = useCurrentRole();

    const status = searchParams.get("statusFilter") || "ALL";

    const onChange = (newStatus: string) => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set("statusFilter", newStatus);
        currentParams.set("page", "1");

        router.push(`${pathname}?${currentParams.toString()}`);
    }

    const FILTERS = useMemo(() => {

        if (role === UserRole.ADMIN) {
            return [
                { label: "Contact", value: "USER" },
            ];
        }

        return [
            { label: "All", value: "ALL" },
            { label: "Contact", value: "USER" },
            { label: "Management", value: "MANAGEMENT" },
            { label: "Admin", value: "ADMIN" }
        ];
    }, [role])

    return (
        <Select value={status} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className={className}>
                <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {FILTERS.map(({ label, value }) =>
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default StatusFilter
