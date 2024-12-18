'use client'
import React from 'react'
import LoadingTemplate from './loading-page';

interface IProps {
    isLoading: boolean;
    isError?: boolean;
    length?: number;
    children: React.ReactNode;
}

const UiDataLoader = ({ length = 0, isError = false, isLoading, children }: IProps) => {

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

export default UiDataLoader