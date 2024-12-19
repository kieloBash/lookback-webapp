'use client'
import { IPageProps } from '@/types/global'
import React from 'react'

const SingleCategoryPage = ({ params: { id } }: IPageProps) => {
    return (
        <div>{id}</div>
    )
}

export default SingleCategoryPage