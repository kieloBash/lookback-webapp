import React from 'react'
import { SalesPieChart } from './_components/sales-pie-chart'
import { TopCategoriesTable } from './_components/top-categories-table'

const AdminOverviewCategories = () => {
    return (
        <section className="w-full h-full p-4 space-y-3">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                    <SalesPieChart />
                </div>
                <div className="col-span-4">
                    <TopCategoriesTable />
                </div>
            </div>
        </section>
    )
}

export default AdminOverviewCategories