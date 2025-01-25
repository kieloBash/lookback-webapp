'use client'
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
import { useRouter } from "next/navigation";
import { REQUESTS_ROUTES } from "@/routes/requests.routes";
import { useQueryClient } from "@tanstack/react-query";
import { NOTIFICATIONS_ROUTES } from "@/routes/notifications.routes";

const url = REQUESTS_ROUTES.USER.CREATE.URL;

export default function RequestPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof RequestSchema>>({
        resolver: zodResolver(RequestSchema),
        defaultValues: {
            dateOfSymptoms: new Date().toISOString().split('T')[0],
            dateOfTesting: new Date().toISOString().split('T')[0],
            symptoms: "",
            medicalImage: "",
            contactNumber: "",
        },
    });

    async function onSubmit(values: z.infer<typeof RequestSchema>) {
        setIsLoading(true);
        await handleAxios({ values, url })
            .then(async () => {
                form.reset();
                queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_ROUTES.USER.FETCH_ALL.KEY], exact: false })
                router.push("/settings");
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
        <article className="w-full p-4">
            <Form {...form}>
                <form className='w-full h-full flex flex-col gap-6' onSubmit={form.handleSubmit(onSubmit)}>
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
                        <FormInput
                            label="Phone Number"
                            name="contactNumber"
                            placeholder="Enter a valid phone 11 digit phone number"
                            control={form.control}
                            disabled={isLoading}
                        />

                        <div className="grid gap-3">
                            <Label>Medical Record</Label>
                            <p className="text-muted-foreground text-sm">Please upload an image showing your COVID test result.</p>
                            <div className="size-32">
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
                    </div>
                </form>
            </Form>
        </article>
    )
}
