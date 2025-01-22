'use client'
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { handleAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';

import FormSelect from '@/components/forms/form-select';

import { UserRole } from '@prisma/client';
import { USERS_ROUTES } from '@/routes/users.routes';
import FormSubmit from '@/components/forms/submit-button';
import UserForm from './_components/user-form';
import ManagementForm from './_components/management-form';
import { AdminUserSchema } from '@/schemas/auth.schema';
import { toast } from '@/hooks/use-toast';

const URL = USERS_ROUTES.ADMIN.CREATE.URL;
const QUERY_KEY = USERS_ROUTES.ADMIN.FETCH_ALL.KEY;
const Schema = AdminUserSchema;

const AdminCreateUserPage = () => {
    const [isLoading, setIsLoading] = useState(false)

    const queryClient = useQueryClient()
    const router = useRouter()

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: undefined,
            user: undefined,
            management: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof Schema>) {
        setIsLoading(true);
        console.log(values)
        await handleAxios({ values, url: URL })
            .then((res) => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: false })
                form.reset();
                router.push("/users/admin/overview")
            })
            .catch((e) => {
                toast({ description: e.response.data, variant: "destructive" })
            })
        setIsLoading(false);
    }

    useEffect(() => {
        form.setValue("user", undefined);
        form.setValue("management", undefined);
    }, [form.watch("role")])


    return (
        <article className="p-4">
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
                            array={Object.keys(UserRole).map((d) => ({ id: d, label: d }))}
                            disabled={isLoading}
                            value={form.watch("role")}
                        />
                        <FormInput
                            control={form.control}
                            name="password"
                            label="Password"
                            type='password'
                            placeholder='Enter password'
                            disabled={isLoading}
                        />
                        <FormSubmit disabled={isLoading}>
                            <span>Create</span>
                        </FormSubmit>
                    </div>
                    <div className="w-full space-y-6 max-w-sm">
                        {form.watch("role") === "USER" && (
                            <UserForm form={form} isLoading={isLoading} />
                        )}
                        {form.watch("role") === "MANAGEMENT" && (
                            <ManagementForm form={form} isLoading={isLoading} />
                        )}
                    </div>
                </form>
            </Form>
        </article>
    )
}

export default AdminCreateUserPage