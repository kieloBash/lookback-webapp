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
import { AdminUserSchema } from '@/schemas/auth.schema';
import { FullAllUserType } from '@/types/user.type';

const URL = USERS_ROUTES.ADMIN.CREATE.URL;
const QUERY_KEY = USERS_ROUTES.ADMIN.FETCH_ALL.KEY;
const Schema = AdminUserSchema;

const EditClientPage = ({ data }: { data: FullAllUserType }) => {
    const [isLoading, setIsLoading] = useState(false)

    const queryClient = useQueryClient()
    const router = useRouter()

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: data.name,
            email: data.email,
            password: "",
            role: data.role as any,
        },
    });

    async function onSubmit(values: z.infer<typeof Schema>) {
        console.log(values);
        // setIsLoading(true);
        // await handleAxios({ values, url: URL })
        //     .then((res) => {
        //         queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: false })
        //         form.reset();
        //         router.push("/users/admin/overview")
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //     })
        // setIsLoading(false);
    }

    // useEffect(() => {
    //     form.setValue("role", data.role);

    //     if (data.role === "USER") {
    //         const v = {
    //             fname: data.userProfile.fname,
    //             lname: data.userProfile.lname,
    //             birthDate: new Date(data.userProfile.birthDate).toISOString().split('T')[0],
    //             gender: data.userProfile.gender as any,
    //             regCode: data.managementProfile.regCode,
    //             provCode: data.managementProfile.provCode,
    //             citymunCode: data.managementProfile.citymunCode,
    //             brgyCode: data.managementProfile.brgyCode,
    //         }
    //         form.setValue("user", v);
    //     } else if (data.role === "MANAGEMENT") {
    //         const v = {
    //             name: data.name,
    //             regCode: data.managementProfile.regCode,
    //             provCode: data.managementProfile.provCode,
    //             citymunCode: data.managementProfile.citymunCode,
    //             brgyCode: data.managementProfile.brgyCode,
    //         }
    //         form.setValue("management", v);
    //     } else {
    //         form.setValue("user", undefined);
    //         form.setValue("management", undefined);
    //     }
    // }, [data])


    console.log(form.control._fields);
    console.log(form.formState.errors);

    
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
                            disabled={true}
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
                </form>
            </Form>
        </article>
    )
}

export default EditClientPage