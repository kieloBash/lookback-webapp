'use client'
import React from 'react'
import { CatIcon, HospitalIcon, User2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UseFormReturn } from 'react-hook-form';

interface IProps {
    form: UseFormReturn<any, any, undefined>;
}

const UserRolesForm = ({ form }: IProps) => {
    const currentRole = form.watch("role");

    const handleChangeRole = (role: "USER" | "MANAGEMENT") => {
        form.setValue("role", role);
        form.setValue("user", undefined);
        form.setValue("management", undefined);
    }

    return (
        <div className="w-full max-w-sm">
            <div className="flex justify-center items-center gap-2">
                <Button type="button" onClick={() => handleChangeRole("USER")} className='size-56 p-2 flex flex-col justify-center items-center' variant={currentRole === "USER" ? "default" : "outline"}>
                    <User2Icon className='size-16' />
                    <span className="text-lg text-wrap">User</span>
                </Button>
                <Button type="button" onClick={() => handleChangeRole("MANAGEMENT")} className='size-56 p-2 flex flex-col justify-center items-center' variant={currentRole === "MANAGEMENT" ? "default" : "outline"}>
                    <HospitalIcon className='size-16' />
                    <span className="text-lg text-wrap">Management</span>
                </Button>
            </div>
        </div>
    )
}

export default UserRolesForm