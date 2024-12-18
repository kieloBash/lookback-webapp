'use client'
import React, { useEffect, useState } from 'react'
import ItemCategoriesSelection from './_components/item-categories'
import { Separator } from '@/components/ui/separator'
import ItemMenu from './_components/menu'

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { InvoiceSchema } from '@/schemas/transaction.schema'
import { useQueryClient } from '@tanstack/react-query'
import { handlePostAxios } from '@/lib/utils'
import InvoiceItems from './_components/invoice'
import { INVOICE_ROUTES } from '@/routes/invoice.routes'
import { useRouter } from 'next/navigation'
import { INVENTORY_ROUTES } from '@/routes/inventory.routes'
import { useCurrentUser } from '@/lib/hooks'


const AdminPOSTransactions = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const queryClient = useQueryClient()
    const user = useCurrentUser();

    const form = useForm<z.infer<typeof InvoiceSchema>>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            items: [],
            date: new Date().toISOString().split('T')[0],
            seller: user?.id ?? ""
        },
    });

    useEffect(() => {
        if (user && user.id) {
            form.setValue("seller", user.id)
        }
    }, [user])


    const fieldForm = useFieldArray({
        control: form.control,
        name: "items"
    });

    function handleSuccess() {
        queryClient.invalidateQueries({ queryKey: [INVOICE_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
        queryClient.invalidateQueries({ queryKey: [INVENTORY_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
        form.reset();
        // router.push("/transactions/admin/overview")
    }

    async function onSubmit(values: z.infer<typeof InvoiceSchema>) {
        setIsLoading(true);
        await handlePostAxios({ values, route: INVOICE_ROUTES.ADMIN.CREATE.URL, handleSuccess })
        setIsLoading(false);
    }

    return (
        <section className="w-full h-full flex">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex gap-4 p-4">
                    <div className="flex flex-col gap-4 flex-1">
                        <ItemCategoriesSelection />
                        <ItemMenu
                            form={form}
                            fieldForm={fieldForm}
                        />
                    </div>
                    <div className="w-full max-w-md">
                        <InvoiceItems isLoading={isLoading} fields={fieldForm.fields} form={form} />
                    </div>
                </form>
            </Form>
        </section>
    )
}

export default AdminPOSTransactions