"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { newVerification } from "../action/action";
import { toast } from "@/hooks/use-toast";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  console.log(token);

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
    newVerification(token)
      .then((d) => {
        if (d.success) {
          toast({ title: "Success", description: d.success });
        } else if (d.error) {
          toast({
            title: "Error",
            description: d.error,
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Something went wrong!",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
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

export default NewVerificationForm;
