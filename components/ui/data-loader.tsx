'use client'
import React from 'react'
import LoadingTemplate from './loading-page';
import { TableCell, TableRow } from './table';
import LoadingIcon from './loading-icon';

interface IProps {
    isLoading: boolean;
    isError?: boolean;
    length?: number;
    columns: number;
    children: React.ReactNode;
    type?: "default" | "table";
}

const UiDefault = ({ length = 0, isError = false, isLoading, children }: IProps) => {
    if (isError) return (
        <article className="size-full flex justify-center items-center">
            <h2 className="text-muted-foreground">An error occured!</h2>
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
                            <h2 className="text-muted-foreground">No Items Found!</h2>
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

const UiTable = ({ length = 0, isError = false, isLoading, children, columns }: IProps) => {
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
                    <LoadingIcon />
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
    else if (props.type === "default") return <UiDefault {...props} />
}

export default UiDataLoader