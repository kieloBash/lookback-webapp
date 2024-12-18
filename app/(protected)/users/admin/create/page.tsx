'use client'
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { handlePostAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';
import FormTextArea from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/forms/submit-button';
import FormSelect from '@/components/forms/form-select';
import { CATEGORY_ICONS } from '@/constants/category-icons';
import { CreateUserSchema } from '@/schemas/auth.schema';
import { UserRole } from '@prisma/client';
import { SELLERS_ROUTES } from '@/routes/sellers.routes';


const AdminCreateUsers = () => {
    const [isLoading, setIsLoading] = useState(false)

    const queryClient = useQueryClient()
    const router = useRouter()

    const form = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "STAFF",
        },
    });

    function handleSuccess() {
        queryClient.invalidateQueries({ queryKey: [SELLERS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
        form.reset();
        router.push("/users/admin/overview")
    }

    async function onSubmit(values: z.infer<typeof CreateUserSchema>) {
        setIsLoading(true);
        await handlePostAxios({ values, route: SELLERS_ROUTES.ADMIN.CREATE.USER.URL, handleSuccess })
        setIsLoading(false);
    }

    return (

        <section className="">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-10 py-6 max-w-xl space-y-6">
                    <FormInput
                        control={form.control}
                        name="name"
                        label="Name"
                        placeholder='Enter name'
                        disabled={isLoading}
                    />
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
                    <SubmitButton disabled={isLoading}>
                        <span>Create</span>
                    </SubmitButton>
                </form>
            </Form>
        </section>
    )
}

export default AdminCreateUsers