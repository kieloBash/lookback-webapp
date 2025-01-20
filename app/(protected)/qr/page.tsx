"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { handleAxios } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { HISTORY_ROUTES } from "@/routes/history.routes";

const QRPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const queryClient = useQueryClient();

    const [tokenVal, setTokenVal] = useState(token)

    const [isLoading, setIsLoading] = useState(true);

    const onSubmit = useCallback(() => {
        setIsLoading(true);

        if (!token) {
            toast({
                title: "Error",
                description: "Missing token!",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        handleAxios({ values: { token: tokenVal }, url: "/api/log/create" })
            .then((res) => {
                setTokenVal("");
                queryClient.invalidateQueries({ queryKey: [HISTORY_ROUTES.USER.FETCH_ALL], exact: false })
                router.push("/scanner");
            })

    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4 pt-4">
            {isLoading && <Loader2 className="w-10 h-10 animate-spin" />}
            <p className="text-center text-sm">Please wait while we update your history!</p>
        </div>
    );
};

export default QRPage;
