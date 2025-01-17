import { currentUser } from '@/lib/auth';
import { getUser } from '@/lib/user'
import { FullUserType } from '@/types/user.type';
import React from 'react'
import SettingsUserClient from './client';

const SettingsUserPage = async () => {
    const user = await currentUser();
    const userProfile = (await getUser(user?.id ?? "")) as FullUserType | null;

    if (!userProfile) return;

    return <SettingsUserClient data={userProfile} />;

}

export default SettingsUserPage