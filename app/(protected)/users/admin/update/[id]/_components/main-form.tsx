"use client"
import React, { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import FormSelect from '@/components/forms/form-select';
import FormSubmit from '@/components/forms/submit-button';
import { handleAxios } from '@/lib/utils';

import { AdminUserSchema } from '@/schemas/auth.schema';
import { FullAllUserType } from '@/types/user.type'
import { UserRole } from '@prisma/client';
import ManagementForm from './management-form';
import UserForm from './user-form';
import { USERS_ROUTES } from '@/routes/users.routes';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';


const EditMainForm = ({ data }: { data: FullAllUserType }) => {
    const Schema = AdminUserSchema;
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: data.name,
            email: data.email,
            password: undefined,
            role: data.role as any,
        },
    });

    async function onSubmit(values: z.infer<typeof Schema>) {
        const updatedValues = { ...values, role: data.role }
        setIsLoading(true);
        await handleAxios({ values: { id: data.id, ...updatedValues }, url: USERS_ROUTES.ADMIN.UPDATE.URL })
            .then(() => {
                queryClient.invalidateQueries({ queryKey: [USERS_ROUTES.ADMIN.FETCH_ALL.KEY] });
                router.push("/users/admin/overview");
            })
            .catch((e) => {
                console.log(e);
            })
        setIsLoading(false);
    }

    useEffect(() => {
        form.setValue("role", data.role as any);

        if (data.role === "USER") {
            const v = {
                fname: data.userProfile.fname,
                lname: data.userProfile.lname,
                birthDate: new Date(data.userProfile.birthDate).toISOString().split('T')[0],
                gender: data.userProfile.gender as any,
                regCode: data.userProfile.regCode,
                provCode: data.userProfile.provCode,
                citymunCode: data.userProfile.citymunCode,
                brgyCode: data.userProfile.brgyCode,
                status: data.userProfile.status as any,
            }
            form.setValue("user", v);
        } else if (data.role === "MANAGEMENT") {
            const v = {
                name: data.name,
                regCode: data.managementProfile.regCode,
                provCode: data.managementProfile.provCode,
                citymunCode: data.managementProfile.citymunCode,
                brgyCode: data.managementProfile.brgyCode,
            }
            form.setValue("management", v);
        } else {
            form.setValue("user", undefined);
            form.setValue("management", undefined);
        }
    }, [data, form])

    useEffect(() => {
        if (data && data.userProfile) {
            form.setValue("user.gender", data.userProfile?.gender as any);
        }
    }, [data, data.userProfile])


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">
                <div className="w-full max-w-sm space-y-6">
                    {form.watch("role") === "ADMIN" && (
                        <FormInput
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder='Enter name'
                            disabled={isLoading}
                        />
                    )}
                    <FormInput
                        control={form.control}
                        name="email"
                        type='email'
                        label="Email Address"
                        placeholder='Enter email'
                        disabled={isLoading}
                    />
                    <FormSelect
                        control={form.control}
                        name="role"
                        label="Role"
                        array={
                            Object.keys(UserRole).map((d) => ({ id: d, label: d }))
                        }
                        value={data.role as any}
                        disabled={true}
                    />
                    <FormInput
                        control={form.control}
                        name="password"
                        label="New Password"
                        type='password'
                        placeholder='Enter password'
                        disabled={isLoading}
                    />
                    <FormSubmit disabled={isLoading}>
                        <span>Save Changes</span>
                    </FormSubmit>
                </div>
                <div className="w-full space-y-6 max-w-sm">
                    {data.role === "USER" && (
                        <UserForm
                            form={form}
                            isLoading={isLoading}
                        />
                    )}
                    {data.role === "MANAGEMENT" && (
                        <ManagementForm
                            form={form}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </form>
        </Form>
    )
}

export default EditMainForm