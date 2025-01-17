import { currentRole } from '@/lib/auth'
import { redirect } from 'next/navigation';

const SettingsPage = async () => {
    const role = await currentRole();

    if (role === "USER") redirect("/settings/user");
    else if (role === "MANAGEMENT") redirect("/settings/management");

    return null
}

export default SettingsPage