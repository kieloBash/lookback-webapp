import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { handlePostAxios } from '@/lib/utils'
import { SELLERS_ROUTES } from '@/routes/sellers.routes'
import { User } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { PenBoxIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface IProps {
    data: User
}
const RowItem = ({ data: { name, id, email, role } }: IProps) => {
    const queryClient = useQueryClient();

    const handleDeleteSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [SELLERS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
    }
    const handleDelete = async () => {
        await handlePostAxios({ values: { id }, route: SELLERS_ROUTES.ADMIN.DELETE.USER.URL, handleSuccess: handleDeleteSuccess })
    }

    return (
        <TableRow key={id}>
            <TableCell className="font-semibold">{email}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell className="flex justify-end items-center gap-1">
                <Link href={`/user/admin/update/${id}`}>
                    <Button variant={"outline"} className="size-7 p-1" type="button">
                        <PenBoxIcon />
                    </Button>
                </Link>
                <Button onClick={handleDelete} variant={"outline"} className="size-7 p-1" type="button">
                    <TrashIcon />
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default RowItem