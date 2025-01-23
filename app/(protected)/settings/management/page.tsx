import React from 'react'
import { currentUser } from '@/lib/auth';
import { getUser } from '@/lib/user'
import { FullManagementUserType } from '@/types/user.type';
import SettingsManagementClient from './client';

const SettingsUserPage = async () => {
    const user = await currentUser();
    const userProfile = (await getUser(user?.id ?? "")) as FullManagementUserType | null;

    if (!userProfile) return;

    return <SettingsManagementClient data={userProfile as any} />

}

export default SettingsUserPage