'use client'
import { Button } from '@/components/ui/button'
import UiSearch from '@/components/ui/search'
import Link from 'next/link'
import React, { useState } from 'react'
import { InvoicesTable } from './_components/invoices-table'
import { UiDatePickerRange } from '@/components/ui/date-range'
import { Separator } from '@/components/ui/separator'
import InvoiceView from './_components/invoice-view'

const AdminOverviewInvoices = () => {
    const [selected, setSelected] = useState("");
    const handleChangeSelected = (newId: string) => {
        setSelected(newId);
    }

    return (
        <section className="w-full h-full flex gap-4 p-4">
            <article className='w-full space-y-4'>
                <div className="flex gap-4 justify-start items-center">
                    <UiSearch className='flex-1' handleResetPage={() => { }} placeholder='Search by INV or by item names...' />
                    <UiDatePickerRange />
                    <Link href={"/transactions/admin/pos"}>
                        <Button type='button'><span>Create Invoice</span></Button>
                    </Link>
                </div>
                <InvoicesTable onChangeSelected={handleChangeSelected} selected={selected} />
            </article>
            <Separator orientation='vertical' />
            <InvoiceView selected={selected} />
        </section>
    )
}

export default AdminOverviewInvoices