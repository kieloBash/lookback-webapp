"use client";

import { FETCH_INTERVAL, FORMAT } from "@/lib/utils";
import { INVOICE_ROUTES } from "@/routes/invoice.routes";
import { FullInvoiceType } from "@/types/invoice.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";

const ROUTE = INVOICE_ROUTES.ADMIN.FETCH_ALL.URL;
const KEY = INVOICE_ROUTES.ADMIN.FETCH_ALL.KEY;
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: FullInvoiceType[];
    totalData: number;
    totalPages: number;
    currentPage: number;
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;
    startDate: string,
    endDate: string,
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",
    startDate,
    endDate
}: FetchParams): Promise<ApiResponse> => {
    const response = await fetch(
        `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}&startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

interface IProps {
    page?: number,
    limit?: number,
    filter?: string,
    searchTerm?: string,
    select?: any
    startDate: Date,
    endDate: Date,
}

const useAdminInvoices = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, startDate, endDate }: IProps
) => {

    const formatStart = format(startDate, FORMAT);
    const formatEnd = format(endDate, FORMAT);

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [KEY, page, limit, filter, searchTerm, formatStart, formatEnd],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, startDate: formatStart, endDate: formatEnd }),
        staleTime: INTERVAL,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        select
    });

    return {
        ...data,
        error,
        isLoading,
        isFetching,
        isError,
    };
};

export default useAdminInvoices;

export const useAdminInvoicesTotal = ({
    startDate = startOfMonth(new Date()),
    endDate = endOfMonth(new Date()),
}: { startDate?: Date; endDate?: Date }) => {
    const res = useAdminInvoices({ startDate, endDate, select: (data: ApiResponse) => { return data } })

    return {
        payload: res?.totalData ?? 0,
        isLoading: res.isLoading,
        isFetching: res.isFetching
    }
}