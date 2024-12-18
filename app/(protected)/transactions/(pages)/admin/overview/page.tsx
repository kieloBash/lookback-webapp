import React from 'react'
import RevenueCard from './_components/revenue'
import CategoriesList from './_components/categories-list'
import ToolsList from './_components/tools-list'
import TopSalesCard from './_components/top-sales'
import CategorySales from './_components/category-sales'
import ItemSales from './_components/item-sales'
import { SalesBarChart } from './_components/sales-bar-chart'
import { SellerBarChart } from './_components/seller-bar-chart'

const AdminOverviewTransactions = () => {
    return (
        <section className="w-full h-full p-4 space-y-3">
            <div className="w-full justify-between items-center flex">
                <CategoriesList />
                <ToolsList />
            </div>
            <div className="w-full flex justify-start items-end gap-2">
                <RevenueCard />
                <TopSalesCard />
            </div>
            <div className="w-full">
                <CategorySales />
            </div>
            <div className="w-full">
                <ItemSales />
            </div>
            <div className="w-full grid grid-cols-5 gap-2">
                <SalesBarChart />
                <SellerBarChart />
            </div>
        </section>
    )
}

export default AdminOverviewTransactions