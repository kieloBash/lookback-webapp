import { getUser } from '@/lib/user';
import { IPageProps } from '@/types/global'
import React from 'react'
import EditMainForm from './_components/main-form';

const UpdateUserPage = async (props: IPageProps) => {
    const id = props.params.id;
    const user = await getUser(id);

    if (!user) return <div className="">Error: user not found</div>

    return (
        <article className="w-full p-4">
            <EditMainForm data={user as any} />
        </article>
    )
}

export default UpdateUserPage