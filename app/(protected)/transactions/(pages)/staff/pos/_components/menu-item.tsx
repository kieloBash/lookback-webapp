import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatPricingNumber } from '@/lib/utils'
import { Item } from '@prisma/client'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React from 'react'

interface IProps {
    item: Item;
    quantity: number;
    onChange: (val: { type: "add" | "remove"; item: Item }) => void;
}

const MenuItem = ({ item, onChange, quantity: invoiceQuantity }: IProps) => {
    const disabled = item.quantity <= 0;
    return (
        <Card>
            <CardHeader>
                <CardTitle className={cn("", disabled && "text-muted-foreground")}>{item.name}</CardTitle>
                <CardDescription>{item?.description ?? "No description available"}</CardDescription>
            </CardHeader>
            <CardContent>
                <h2 className={cn("text-4xl font-bold", disabled && "text-muted")}>{formatPricingNumber(item.price)}</h2>
            </CardContent>
            <CardFooter className='flex-row justify-between items-center'>
                <p className="text-sm text-muted-foreground">{item.quantity} in stocks</p>
                <div className="flex justify-center items-center gap-2">
                    <Button disabled={disabled} onClick={() => onChange({ type: "remove", item })} type="button" className='size-7'><MinusIcon /></Button>
                    <span className={cn("text-center text-4xl font-bold", disabled && "text-muted")}>{invoiceQuantity}</span>
                    <Button disabled={disabled} onClick={() => onChange({ type: "add", item })} type="button" className='size-7'><PlusIcon /></Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default MenuItem