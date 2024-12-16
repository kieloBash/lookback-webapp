'use client'
import { useCurrentRole } from '@/lib/hooks'
import { useRouter } from 'next/navigation'

const DashboardPage = () => {
    const router = useRouter();
    const role = useCurrentRole();

    if (!role) router.push("/auth/error")

    if (role === "ADMIN") router.push("/dashboard/admin")
    else if (role === "STAFF") router.push("/dashboard/staff")
}

export default DashboardPage