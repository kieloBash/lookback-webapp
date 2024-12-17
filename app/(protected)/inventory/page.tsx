'use client'
import { useCurrentRole } from '@/lib/hooks'
import { useRouter } from 'next/navigation'

const InventoryPage = () => {
    const router = useRouter();
    const role = useCurrentRole();

    if (!role) router.push("/auth/error")

    if (role === "ADMIN") router.push("/inventory/admin")
    if (role === "STAFF") router.push("/inventory/staff")
}

export default InventoryPage