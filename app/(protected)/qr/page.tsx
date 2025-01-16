"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { handleAxios } from "@/lib/utils";

const QRPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

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
                router.push("/history");
            })

    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-4">
            {isLoading && <Loader2 className="w-10 h-10 animate-spin" />}
            <Link href={"/auth/sign-in"}>
                <Button variant={"link"}>Back to login!</Button>
            </Link>
        </div>
    );
};

export default QRPage;
