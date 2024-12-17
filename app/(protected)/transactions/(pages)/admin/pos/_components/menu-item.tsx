import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPricingNumber } from '@/lib/utils'
import { Item } from '@prisma/client'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React from 'react'

interface IProps {
    item: Item;
    quantity: number;
    onChange: (val: { type: "add" | "remove"; item: Item }) => void;
}

const MenuItem = ({ item, onChange, quantity: invoiceQuantity }: IProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item?.description ?? "No description available"}</CardDescription>
            </CardHeader>
            <CardContent>
                <h2 className="text-4xl font-bold">{formatPricingNumber(item.price)}</h2>
            </CardContent>
            <CardFooter className='flex-row justify-between items-center'>
                <p className="text-sm text-muted-foreground">{item.quantity} in stocks</p>
                <div className="flex justify-center items-center gap-2">
                    <Button onClick={() => onChange({ type: "remove", item })} type="button" className='size-7'><MinusIcon /></Button>
                    <span className="text-center text-4xl font-bold">{invoiceQuantity}</span>
                    <Button onClick={() => onChange({ type: "add", item })} type="button" className='size-7'><PlusIcon /></Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default MenuItem