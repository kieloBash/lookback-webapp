import React from "react";
import NewVerificationForm from "./components/verification-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NewVerificationPage = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl">Verify!</CardTitle>
          <CardDescription>Confirming your verification!</CardDescription>
        </CardHeader>
        <CardContent>
          <NewVerificationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewVerificationPage;
