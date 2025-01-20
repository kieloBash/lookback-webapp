import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from "react";

import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RequestSchema } from "@/schemas/request.schema";
import { handleAxios } from '@/lib/utils'
import { FormInput } from "@/components/forms/form-input";
import FormTextArea from "@/components/forms/form-textarea";
import FormSubmit from "@/components/forms/submit-button";
import UiImageUpload from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";

interface IProps {
    children: React.ReactNode
}

const url = "/api/request/create";

export default function RequestModal({ children }: IProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof RequestSchema>>({
        resolver: zodResolver(RequestSchema),
        defaultValues: {
            dateOfSymptoms: new Date().toISOString().split('T')[0],
            dateOfTesting: new Date().toISOString().split('T')[0],
            symptoms: "",
            medicalImage: "",
        },
    });

    async function onSubmit(values: z.infer<typeof RequestSchema>) {
        // console.log(values)
        setIsLoading(true);
        await handleAxios({ values, url })
            .then(async () => {
                form.reset();
            })
            .catch(() => {
                console.log("Error");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function handleUploadImage(data: any) {
        form.setValue("medicalImage", data.info.secure_url);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Make a request</DialogTitle>
                    <DialogDescription>
                        Please fill up the necessary details first and we&apos;ll let our admins check the validity in a short while. Thank you!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='w-full flex flex-col items-center justify-center gap-6' onSubmit={form.handleSubmit(onSubmit)}>

                        <div className="grid gap-3 w-full max-w-md">
                            <FormTextArea
                                label="Symptoms"
                                name="symptoms"
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormInput
                                type="date"
                                label="Date of First Symptoms"
                                name="dateOfSymptoms"
                                description="Please indicate the date of when you first had these symptoms"
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormInput
                                type="date"
                                label="Date of Testing Positive"
                                name="dateOfTesting"
                                description="Please indicate when you had your covid test"
                                control={form.control}
                                disabled={isLoading}
                            />

                            <div className="grid gap-3">
                                <Label>Medical Record</Label>
                                <p className="text-muted-foreground text-sm">Please upload an image showing your COVID test result.</p>
                                <UiImageUpload
                                    handleUpload={handleUploadImage}
                                    preset="sandbox"
                                    tipLabel="Click to add medical"
                                    hasImage={form.watch("medicalImage") !== ""}
                                    imageSrc={form.watch("medicalImage")}
                                />
                            </div>
                        </div>

                        <FormSubmit
                            className='w-full'
                            disabled={isLoading}
                        >
                            <span>Submit</span>
                        </FormSubmit>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
