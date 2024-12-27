"use client"
import { FormInput } from '@/components/forms/form-input';
import FormSelect from '@/components/forms/form-select';
import SubmitButton from '@/components/forms/submit-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAdminSellersList } from '@/hooks/admin/use-sellers';
import { formatPricingNumber } from '@/lib/utils';
import React, { useMemo } from 'react'

interface IProps { fields: any[]; isLoading: boolean; form: any }

const InvoiceItems = ({ fields, isLoading, form }: IProps) => {

    const sub_total = useMemo(() => {
        return fields.reduce((acc, i) => acc + (i.quantity * i.price), 0)
    }, [fields])

    const tax = useMemo(() => {
        return sub_total * 0.05
    }, [sub_total])

    const sellers = useAdminSellersList();

    return (
        <Card className='overflow-hidden relative'>
            <div className="absolute top-2 right-4 flex justify-center items-center gap-2">
                <FormInput
                    type='date'
                    name='date'
                    control={form.control}
                />
                <FormSelect
                    name='seller'
                    value={form.watch("seller")}
                    array={sellers.payload}
                    control={form.control}
                />
            </div>
            <CardHeader className=''>
                <CardTitle>
                    <span>Invoice</span>
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {
                    fields.map((item: any) => (
                        <div className="flex justify-between" key={item.sku}>
                            <div className="flex flex-col justify-between items-start">
                                <h2 className="text-lg font-bold">{item.name}</h2>
                                <h3 className="text-sm text-muted-foreground">{formatPricingNumber(item.price)} x {item.quantity.toLocaleString()}</h3>
                                <p className='text-sm text-muted-foreground'>{item.description}</p>
                            </div>
                            <div className="flex flex-col justify-end items-baseline">
                                <h2 className="font-bold text-xl">{formatPricingNumber((item.price * item.quantity))}</h2>
                            </div>
                        </div>
                    ))
                }
            </CardContent>
            <CardFooter className='flex-col gap-3 bg-muted pt-4'>
                <Label className='text-left w-full'>Payment Summary</Label>
                <div className="w-full flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Sub Total</p>
                    <span className='font-bold'>{formatPricingNumber(sub_total)}</span>
                </div>
                <div className="w-full flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Tax</p>
                    <span className='font-bold'>{formatPricingNumber(tax)}</span>
                </div>
                <Separator />
                <div className="w-full flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Total</p>
                    <span className='font-bold'>{formatPricingNumber((sub_total + tax))}</span>
                </div>
                <SubmitButton className='w-full' disabled={isLoading}><span>Confirm Sale</span></SubmitButton>
            </CardFooter>
        </Card>
    )
}

export default InvoiceItems