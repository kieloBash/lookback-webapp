import UiQRView from '@/components/ui-project/qr-view';
import { currentUser } from '@/lib/auth'
import { getManagementUserById } from '@/lib/user'
import React from 'react'

async function fetchData() {
    const user = await currentUser();
    return await getManagementUserById(user?.id ?? "");
}

const ManagementScannerPage = async () => {
    const data = await fetchData()

    if (!data) return null;

    return (
        <section className="w-full h-full pt-20 flex flex-col justify-center items-center gap-4">
            <h1 className="text-center text-4xl font-medium">{data.name}</h1>
            <UiQRView value={data.id} />
        </section>
    )
}

export default ManagementScannerPage