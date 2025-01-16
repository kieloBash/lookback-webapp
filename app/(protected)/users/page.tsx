import React from 'react'
import { currentRole } from '@/lib/auth'
import { redirect } from 'next/navigation';

const UsersPage = async () => {
    const role = await currentRole();

    if (role === "ADMIN") redirect("/users/admin/overview");

    return null
}

export default UsersPage