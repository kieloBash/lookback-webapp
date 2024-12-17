'use client'
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { CategorySchema } from '@/schemas/category.schema';
import { handlePostAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';
import FormTextArea from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { CATEGORIES_ROUTES } from '@/routes/categories.routes';
import SubmitButton from '@/components/forms/submit-button';
import FormSelect from '@/components/forms/form-select';
import { CATEGORY_ICONS } from '@/constants/category-icons';


const AdminCreateCategories = () => {
    const [isLoading, setIsLoading] = useState(false)

    const queryClient = useQueryClient()
    const router = useRouter()

    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
            icon: ""
        },
    });

    function handleSuccess() {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
        form.reset();
        router.push("/categories/admin/overview")
    }

    async function onSubmit(values: z.infer<typeof CategorySchema>) {
        setIsLoading(true);
        await handlePostAxios({ values, route: CATEGORIES_ROUTES.ADMIN.CREATE.URL, handleSuccess })
        setIsLoading(false);
    }

    return (

        <section className="">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-10 py-6 max-w-xl space-y-6">
                    <FormInput
                        control={form.control}
                        name="name"
                        label="Category Name"
                        placeholder='Enter the name of the category'
                        disabled={isLoading}
                    />
                    <FormSelect
                        control={form.control}
                        name="icon"
                        label="Category Icon"
                        array={CATEGORY_ICONS.map((d) => { return { id: d, label: d } })}
                        disabled={isLoading}
                        value={form.watch("icon")}
                    />
                    <FormTextArea
                        control={form.control}
                        name="description"
                        label="Category Description"
                        placeholder='Describe the category'
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

export default AdminCreateCategories