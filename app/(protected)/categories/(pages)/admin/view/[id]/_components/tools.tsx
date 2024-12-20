'use client'
import React from 'react'

import { useQueryClient } from "@tanstack/react-query"
import { CATEGORIES_ROUTES } from "@/routes/categories.routes"
import { handlePostAxios } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


const ViewTools = ({ id }: { id: string }) => {
    const router = useRouter()
    const queryClient = useQueryClient();

    const handleSuccessDelete = () => {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
        router.push("/categories/admin/overview")
    }

    const handleDeleteCategory = async (id: string) => {
        await handlePostAxios({ values: { id }, route: CATEGORIES_ROUTES.ADMIN.DELETE.URL, handleSuccess: handleSuccessDelete })
    }


    return (
        <div className="flex gap-2">
            <Button type='button' size={"sm"} variant={"outline"}>Export Data</Button>
            <Link href={`/categories/admin/update/${id}`}>
                <Button type='button' size={"sm"} variant={"outline"}>Edit</Button>
            </Link>
            <Button onClick={() => handleDeleteCategory(id)} type='button' size={"sm"} variant={"destructive"}>Delete</Button>
        </div>
    )
}

export default ViewTools