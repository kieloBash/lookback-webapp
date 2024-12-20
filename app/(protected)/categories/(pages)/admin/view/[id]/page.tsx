import { Button } from '@/components/ui/button'
import { IPageProps } from '@/types/global'
import React from 'react'

import { CategoryDailySales } from './_components/daily-sales'
import { ItemsTable } from './_components/items-table'
import Link from 'next/link'
import ViewTools from './_components/tools'

const SingleCategoryPage = ({ params: { id } }: IPageProps) => {
    return (
        <section className="w-full h-full space-y-3 p-4">
            <div className="w-full flex justify-end items-center">
                <ViewTools id={id} />
            </div>

            <div className="w-full flex gap-4">
                <div className="w-full max-w-2xl">
                    <CategoryDailySales id={id} />
                </div>
                <div className="flex-1">
                    <ItemsTable id={id} />
                </div>
            </div>
        </section>
    )
}

export default SingleCategoryPage