import { db } from '@/lib/db';
import { IPageProps } from '@/types/global'
import React from 'react'
import UpdateCategoryForm from './_components/form';

async function fetchCategoryById(id: string) {
    try {
        return await db.category.findFirst({ where: { id } });
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
}

const SingleCategoryUpdatePage = async ({ params: { id } }: IPageProps) => {
    const data = await fetchCategoryById(id);

    if (!data) return <div>Category not found</div>

    return (
        <UpdateCategoryForm prevData={data as any} />
    )
}

export default SingleCategoryUpdatePage