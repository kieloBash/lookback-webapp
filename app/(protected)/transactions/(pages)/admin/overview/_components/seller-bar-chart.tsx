"use client"

import { DollarSignIcon, TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useSearchParams } from "next/navigation"
import { endOfMonth, format, startOfMonth } from "date-fns"
import useSellerSales from "@/hooks/analytics/use-seller-sales"
import { useMemo } from "react"
import LoadingTemplate from "@/components/ui/loading-page"
// const chartData = [
//     { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//     { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//     { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//     { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//     { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

const chartConfig = {
    sales: {
        label: "Sales",
    },
    seller1: {
        color: "hsl(var(--chart-1))",
    },
    seller2: {
        color: "hsl(var(--chart-2))",
    },
    seller3: {
        color: "hsl(var(--chart-3))",
    },
    seller4: {
        color: "hsl(var(--chart-4))",
    },
    seller5: {
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function SellerBarChart() {

    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const seller_sales = useSellerSales({ startDate, endDate });
    const chartDatas = useMemo(() => {
        if (seller_sales.isLoading || !seller_sales?.salesBySeller)
            return []
        return seller_sales.salesBySeller
    }, [seller_sales])

    if (seller_sales.isLoading) return <LoadingTemplate />

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Sales by Sellers</CardTitle>
                <CardDescription>
                    Showing total of {format(startDate, "MMMM dd")} to {format(endDate, "MMMM dd")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartDatas}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="seller.name"
                            type="category"
                            tickLine={false}
                            tickMargin={2}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value
                            }
                        />
                        <XAxis dataKey="sales" type="number" hide />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return value
                                    }}
                                    indicator="line" />
                            }
                            cursor={false}
                            defaultIndex={1}
                        />
                        <Bar dataKey="sales" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    )
}
