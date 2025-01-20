'use client'
import React from 'react'
import LoadingTemplate from './loading-page';
import UiLoading from './loading-page';
import { TableCell, TableRow } from '../ui/table';

interface IProps {
    isLoading: boolean;
    isError?: boolean;
    length?: number;
    columns?: number;
    children: React.ReactNode;
    type?: "default" | "table";

    message?: {
        no_items?: string;
        error?: string;
    }
}

const DEFAULT_MESSAGE = {
    no_items: "No items found!",
    error: "An error occured!"
}

const UiDefault = ({ length = 0, isError = false, isLoading, children, message = DEFAULT_MESSAGE }: IProps) => {
    if (isError) return (
        <article className="size-full flex justify-center items-center">
            <h2 className="text-muted-foreground">{message.error ?? DEFAULT_MESSAGE.error}</h2>
        </article>
    )

    return (
        <div className='size-full'>
            {isLoading ?
                <LoadingTemplate />
                :
                <div className='size-full'>
                    {length <= 0 ?
                        <div className='size-full flex justify-center items-center'>
                            <h2 className="text-muted-foreground">{message.no_items ?? DEFAULT_MESSAGE.no_items}</h2>
                        </div> :
                        <div className='size-full'>
                            {children}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

const UiTable = ({ length = 0, isError = false, isLoading, children, columns = 0 }: IProps) => {
    if (isError) return (
        <TableRow>
            <TableCell colSpan={columns}>
                <p className="text-center text-muted-foreground p-4">An error occured!</p>
            </TableCell>
        </TableRow>
    )

    if (isLoading) return (
        <TableRow>
            <TableCell className='' colSpan={columns}>
                <div className="p-4 flex justify-center items-center">
                    <UiLoading type='icon' />
                </div>
            </TableCell>
        </TableRow>
    )

    if (length === 0) return (
        <TableRow>
            <TableCell colSpan={columns}>
                <p className="text-center text-muted-foreground p-4">No items found!</p>
            </TableCell>
        </TableRow>
    )

    return children;
}

const UiDataLoader = (props: IProps) => {
    if (props.type === "table") return <UiTable {...props} />
    else return <UiDefault {...props} />
}

export default UiDataLoader