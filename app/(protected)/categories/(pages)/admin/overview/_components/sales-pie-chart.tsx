"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

import useCategorySales from "@/hooks/analytics/use-category-sales"

import { useSearchParams } from 'next/navigation';
import { formatPricingNumber } from '@/lib/utils'
import { endOfMonth, format, startOfMonth } from 'date-fns'

import { UiDatePickerRange } from "@/components/ui/date-range"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    price: {
        label: "Sales",
    },
    category1: {
        color: "hsl(var(--chart-1))",
    },
    category2: {
        color: "hsl(var(--chart-2))",
    },
    category3: {
        color: "hsl(var(--chart-3))",
    },
    category4: {
        color: "hsl(var(--chart-4))",
    },
    category5: {
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function SalesPieChart() {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const sales = useCategorySales({ startDate, endDate })

    const chartDatas = React.useMemo(() => {
        if (sales.isLoading || !sales.categorySales) return []
        return sales.categorySales.map((d, idx) => ({ ...d, fill: `var(--color-category${idx % 5 + 1})` }))
    }, [sales]);

    const totalSales = React.useMemo(() => {
        return chartDatas?.reduce((acc, curr) => acc + curr.price, 0)
    }, [chartDatas])

    if (sales.isLoading) return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="useCategoryIdSalesw-full rounded-xl" />
        </div>
    )

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0 gap-1">
                <CardTitle>Category Sales</CardTitle>
                <UiDatePickerRange />
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartDatas}
                            dataKey="price"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {formatPricingNumber(totalSales)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Sales
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing total sales per category on {format(startDate, "MMM dd")} to {format(endDate, "MMM dd")}
                </div>
            </CardFooter>
        </Card>
    )
}
