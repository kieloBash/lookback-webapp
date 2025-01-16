import { currentRole } from '@/lib/auth'
import { redirect } from 'next/navigation';

const HistoryPage = async () => {
    const role = await currentRole();

    if (role === "USER") redirect("/history/user");
    else if (role === "MANAGEMENT") redirect("/history/management");

    return null
}

export default HistoryPage