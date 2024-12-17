'use client'
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { handlePostAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';
import FormTextArea from '@/components/forms/form-textarea';
import { CATEGORIES_ROUTES } from '@/routes/categories.routes';
import SubmitButton from '@/components/forms/submit-button';
import { TransactionSchema } from '@/schemas/transaction.schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FormSelect from '@/components/forms/form-select';
import { Button } from '@/components/ui/button';
import useAdminCategories, { useAdminCategoriesList } from '@/hooks/admin/use-categories';
import LoadingTemplate from '@/components/ui/loading-page';
import { Separator } from '@/components/ui/separator';
import { ItemsTable } from './_components/item-table';


const AdminCreateTransaction = () => {
    const [isLoading, setIsLoading] = useState(false)
    const categories = useAdminCategoriesList();

    const queryClient = useQueryClient()
    const router = useRouter()

    const form = useForm<z.infer<typeof TransactionSchema>>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            items: [],
            currentItem: undefined,
            date: new Date().toISOString().split('T')[0]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    function handleSuccess() {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
        form.reset();
        // router.push("/categories/admin/overview")
    }

    function handleAddItem() {
        const currentItem = form.getValues("currentItem");
        if (currentItem) {
            append({
                ...currentItem,
                categoryLabel: categories.payload?.find((d) => d.id === currentItem.category)?.label,
                totalAmount: currentItem.price * currentItem.quantity
            })
            form.setValue("currentItem.name", "")
            form.setValue("currentItem.description", "")
            form.setValue("currentItem.category", "")
            form.setValue("currentItem.quantity", 0)
            form.setValue("currentItem.reorderLevel", 0)
            form.setValue("currentItem.price", 0)
            form.setValue("currentItem", undefined)
        }
    }


    async function onSubmit(values: z.infer<typeof TransactionSchema>) {
        console.log(values)
        // setIsLoading(true);
        // await handlePostAxios({ values, route: CATEGORIES_ROUTES.ADMIN.CREATE.URL, handleSuccess })
        // setIsLoading(false);
    }

    console.log(fields)

    if (categories.isLoading) return <LoadingTemplate />

    return (

        <section className="flex justify-between items-start">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-10 py-6 max-w-xl space-y-6">
                    <FormInput
                        control={form.control}
                        type='date'
                        name="date"
                        label="Transaction Date"
                        disabled={isLoading}
                    />
                    <Separator />
                    <FormInput
                        control={form.control}
                        name="currentItem.name"
                        label="Item Name"
                        placeholder='Enter the name of the item'
                        disabled={isLoading}
                    />
                    <FormTextArea
                        control={form.control}
                        name="currentItem.description"
                        label="Item Description"
                        placeholder='Describe the item'
                        disabled={isLoading}
                    />
                    <FormSelect
                        control={form.control}
                        name="currentItem.category"
                        label="Item Category"
                        array={categories.payload ?? []}
                        value={form.watch("currentItem.category")}
                        disabled={isLoading}
                    />
                    <FormInput
                        control={form.control}
                        type="number"
                        name="currentItem.quantity"
                        label="Item Quantity"
                        placeholder='Enter the quantity of the item'
                        disabled={isLoading}
                    />
                    <FormInput
                        control={form.control}
                        type="number"
                        name="currentItem.reorderLevel"
                        label="Item Minimum Reorder"
                        placeholder='Enter the reorder of the item'
                        description='This indicates at what point will we remind the user of the stock of the item'
                        disabled={isLoading}
                    />
                    <FormInput
                        control={form.control}
                        type="number"
                        name="currentItem.price"
                        label="Item Price"
                        placeholder='Enter the price of the item'
                        disabled={isLoading}
                    />
                    <div className="flex gap-2 justify-start items-center">
                        <Button disabled={isLoading} type='button' onClick={handleAddItem}>
                            <span>Add Item</span>
                        </Button>
                        <SubmitButton disabled={isLoading}>
                            <span>Submit Transaction</span>
                        </SubmitButton>
                    </div>
                </form>
            </Form>
            <div className="flex-1 pr-10 py-14">
                <ItemsTable items={fields} />
            </div>
        </section>
    )
}

export default AdminCreateTransaction