import { currentRole } from '@/lib/auth'
import { redirect } from 'next/navigation';

const RequestsPage = async () => {
    const role = await currentRole();

    if (role === "USER") redirect("/requests/user");
    else if (role === "MANAGEMENT") redirect("/requests/management");
    else if (role === "ADMIN"|| role === "HEAD_ADMIN") redirect("/requests/admin");

    return null
}

export default RequestsPage