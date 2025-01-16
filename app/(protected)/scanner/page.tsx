import { currentRole } from '@/lib/auth'
import { redirect } from 'next/navigation';

const ScannerPage = async () => {
    const role = await currentRole();

    if (role === "USER") redirect("/scanner/user");
    else if (role === "MANAGEMENT") redirect("/scanner/management");

    return null
}

export default ScannerPage