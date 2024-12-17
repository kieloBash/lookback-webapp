'use client'
import FormBaseInput from '@/components/forms/form-base-input';
import FormBaseSelect from '@/components/forms/form-base-select';
import { Label } from '@/components/ui/label';
import { useAdminCategoriesList } from '@/hooks/admin/use-categories';
import { generateRandomSKU } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import { useFieldArray } from 'react-hook-form';

interface IProps {
    form: any
    activeCategory: { id: string; label: string } | undefined
}

const ItemCreateNewForm = ({ form, activeCategory }: IProps) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState(activeCategory ?? undefined);
    const [sku, setSKU] = useState("");
    const [stocks, setStocks] = useState(0);
    const [price, setPrice] = useState(0);
    const [restockLevel, setRestockLevel] = useState(0);

    const categories = useAdminCategoriesList();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    useEffect(() => {
        // Generate a new SKU when the component mounts
        setSKU(generateRandomSKU());
    }, []);

    useEffect(() => {
        if (activeCategory)
            setCategory(activeCategory)
    }, [activeCategory])


    return (
        <div className="w-full space-y-6">
            <FormBaseInput
                value={sku}
                onChange={(e) => setSKU(e)}
                label="SKU of Item"
                disabled
                description='This is the unique identifier of an item'
            />
            <FormBaseInput
                value={name}
                onChange={(e) => setName(e)}
                label="Name of Item"
            />
            <FormBaseSelect
                value={category?.id ?? ""}
                onChange={(e) => {
                    const newVal = categories?.payload?.find((d) => d.id === e)
                    if (newVal) {
                        setCategory(newVal)
                    }
                }}
                label="Category of Item"
                array={categories?.payload ?? []}
            />
            <FormBaseInput
                type='number'
                value={stocks}
                onChange={(e) => setStocks(e)}
                label="Quantity of Item"
            />
            <FormBaseInput
                type='number'
                value={price}
                onChange={(e) => setPrice(e)}
                label="Price of Item"
            />
            <FormBaseInput
                type='number'
                value={restockLevel}
                onChange={(e) => setRestockLevel(e)}
                label="Restock Level of Item"
                description='This is the point where the system would notify the user if the quantity of the item reaches this number'

            />
        </div>
    )
}

export default ItemCreateNewForm