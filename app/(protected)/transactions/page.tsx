'use client'
import { useCurrentRole } from '@/lib/hooks'
import { useRouter } from 'next/navigation'

const TransactionsPage = () => {
    const router = useRouter();
    const role = useCurrentRole();

    if (!role) router.push("/auth/error")

    if (role === "ADMIN") router.push("/transactions/admin/overview")
    if (role === "STAFF") router.push("/transactions/staff/invoices")
}

export default TransactionsPage