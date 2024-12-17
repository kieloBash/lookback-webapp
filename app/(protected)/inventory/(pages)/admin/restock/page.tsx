'use client'
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { generateRandomSKU, handlePostAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';
import { CATEGORIES_ROUTES } from '@/routes/categories.routes';
import SubmitButton from '@/components/forms/submit-button';
import { RestockInventorySchema } from '@/schemas/transaction.schema';
import FormSelect from '@/components/forms/form-select';
import useAdminCategories, { useAdminCategoriesList } from '@/hooks/admin/use-categories';
import LoadingTemplate from '@/components/ui/loading-page';
import ItemCategoriesSelection from './_components/item-categories';
import { ItemExistingTable } from './_components/item-existing-table';
import { INVENTORY_ROUTES } from '@/routes/inventory.routes';

import { usePathname, useSearchParams } from 'next/navigation';

const AdminRestockInventory = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient()

    const [isLoading, setIsLoading] = useState(false)
    const filter = searchParams.get("filter") || "all";

    const handleActiveCategoryChange = (newVal: { id: string; label: string }) => {
        if (newVal.id === filter) {
            handleChangeCategory("all")
        }
        else {
            handleChangeCategory(newVal.id)
        }
    }

    const categories = useAdminCategoriesList();

    const form = useForm<z.infer<typeof RestockInventorySchema>>({
        resolver: zodResolver(RestockInventorySchema),
        defaultValues: {
            item: {
                sku: "",
                name: "",
                description: undefined,
                category: "",
                categoryLabel: undefined,

                quantity: 0,
                reorderLevel: 0,
                price: 0,
            },
            date: new Date().toISOString().split('T')[0]
        },
    });

    useEffect(() => {
        form.setValue("item.sku", generateRandomSKU())
    }, [])

    useEffect(() => {
        if (filter === "all") {
            form.setValue("item.category", "")
        } else {
            form.setValue("item.category", filter)
        }
    }, [filter])


    const handleChangeCategory = (newVal: string) => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set("filter", newVal);

        router.push(`${pathname}?${currentParams.toString()}`);
    }

    function handleSuccess() {
        queryClient.invalidateQueries({ queryKey: [INVENTORY_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
        form.reset();
        form.setValue("item.sku", generateRandomSKU())
        // router.push("/categories/admin/overview")
    }


    async function onSubmit(values: z.infer<typeof RestockInventorySchema>) {
        setIsLoading(true);
        await handlePostAxios({ values, route: INVENTORY_ROUTES.ADMIN.CREATE.ITEM.URL, handleSuccess })
        setIsLoading(false);
    }

    if (categories.isLoading) return <LoadingTemplate />

    return (

        <section className="flex justify-between items-start">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-10 py-6 max-w-7xl space-y-6">
                    <ItemCategoriesSelection
                        handleActiveCategoryChange={handleActiveCategoryChange} />
                    <div className="flex w-full gap-2 justify-between items-start">
                        <ItemExistingTable />
                        <div className="w-full space-y-6">
                            <FormInput
                                label='SKU of Item'
                                name='item.sku'
                                control={form.control}
                                disabled
                                description='This is the unique identifier of an item'
                            />
                            <FormInput
                                label='Name of Item'
                                name='item.name'
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormSelect
                                label='Category of Item'
                                name='item.category'
                                control={form.control}
                                value={form.watch("item.category")}
                                array={categories.payload ?? []}
                                disabled={isLoading}
                            />
                            <FormInput
                                type='number'
                                label='Price of Item'
                                name='item.price'
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormInput
                                type='number'
                                label='Quantity of Item'
                                name='item.quantity'
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormInput
                                type='number'
                                label='Restock Level of Item'
                                name='item.reorderLevel'
                                control={form.control}
                                description='This is the point where the system would notify the user if the quantity of the item reaches this number'
                                disabled={isLoading}
                            />
                            <SubmitButton disabled={isLoading}><span>Submit</span></SubmitButton>
                        </div>
                        {/* <ItemCreateNewForm form={form} activeCategory={activeCategory} /> */}
                    </div>
                </form>
            </Form>
        </section>
    )
}

export default AdminRestockInventory