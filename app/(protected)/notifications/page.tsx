import { currentRole } from '@/lib/auth'
import { redirect } from 'next/navigation';

const NotificationsPage = async () => {
    const role = await currentRole();

    if (role === "USER") redirect("/notifications/user");
    else if (role === "MANAGEMENT") redirect("/notifications/management");
    else if (role === "ADMIN") redirect("/notifications/admin");

    return null
}

export default NotificationsPage