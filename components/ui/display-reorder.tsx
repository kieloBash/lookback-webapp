import { cn } from '@/lib/utils';
import React from 'react'

interface IProps {
    restock: number;
    stock: number;
    className?: string
}

const UiReorderStocks = ({ restock, stock, className }: IProps) => {
    const CLASS_NAME = cn("font-semibold", className,
        stock > restock && "text-green-500",
        stock - 3 === restock && "text-blue-500",
        stock <= restock && "text-red-500"
    )
    return (
        <span className={CLASS_NAME}>
            {stock}
        </span>
    )
}

export default UiReorderStocks