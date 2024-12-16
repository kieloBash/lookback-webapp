'use client'
import { useCurrentRole } from '@/lib/hooks'
import { useRouter } from 'next/navigation'

const CategoriesPage = () => {
    const router = useRouter();
    const role = useCurrentRole();

    if (!role) router.push("/auth/error")

    if (role === "ADMIN") router.push("/dashboard/admin")
}

export default CategoriesPage