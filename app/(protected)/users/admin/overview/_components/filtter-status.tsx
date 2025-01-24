'use client'
import React from 'react'
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


interface IProps {
    className?: string
}

const StatusFilter = ({ className }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const status = searchParams.get("statusFilter") || "ALL";

    const onChange = (newStatus: string) => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set("statusFilter", newStatus);
        currentParams.set("page", "1");

        router.push(`${pathname}?${currentParams.toString()}`);
    }

    return (
        <Select value={status} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className={className}>
                <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="MANAGEMENT">Management</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default StatusFilter
