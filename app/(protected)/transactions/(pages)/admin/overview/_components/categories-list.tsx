'use client'
import { Button } from '@/components/ui/button';
import UiCategoriesIcon from '@/components/ui/ui-categories-icon';
import useAdminCategories, { useAdminCategoriesList } from '@/hooks/admin/use-categories'
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const CategoriesList = () => {
    const categories = useAdminCategories({});

    return (
        <ul className="flex justify-start items-center gap-1">
            <li>
                <Link href={"/categories/admin/create"}>
                    <Button className='size-7 p-1 rounded-full' type='button'><PlusIcon /></Button>
                </Link>
            </li>
            {
                categories?.payload?.map((item) => {
                    return (
                        <li className="h-7 px-2 py-1 border rounded-full text-xs font-medium flex gap-1 justify-center items-center" key={item.id}>
                            <UiCategoriesIcon icon={item.icon} className='size-3' />
                            <span className="text-center">{item.name}</span>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default CategoriesList