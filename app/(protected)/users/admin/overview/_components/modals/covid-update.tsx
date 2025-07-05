"use client"

import type React from "react"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Upload, Thermometer, TestTube } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import UiLoading from "@/components/ui/loading-page"
import { FullUserType } from "@/types/user.type"
import { useQueryClient } from "@tanstack/react-query"
import { USERS_ROUTES } from "@/routes/users.routes"

interface CovidInfoData {
    dateOfSymptoms: string
    dateOfTesting: string
    symptoms: string[]
    customSymptoms: string
    medicalImage: File | null
}

const commonSymptoms = [
    "Fever",
    "Cough",
    "Shortness of breath",
    "Fatigue",
    "Body aches",
    "Headache",
    "Loss of taste or smell",
    "Sore throat",
    "Congestion",
    "Nausea or vomiting",
    "Diarrhea",
]

interface IProps {
    open: boolean;
    setOpen: (e: boolean) => void
    contactData: FullUserType
}

const url = `/api/covid/auto-update`

export default function CovidUpdateModal({ open, setOpen, contactData }: IProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("");
    const queryClient = useQueryClient();
    console.log({ contactData })

    const [formData, setFormData] = useState<CovidInfoData>({
        dateOfSymptoms: "",
        dateOfTesting: "",
        symptoms: [],
        customSymptoms: "",
        medicalImage: null,
    })

    const handleSymptomChange = (symptom: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            symptoms: checked ? [...prev.symptoms, symptom] : prev.symptoms.filter((s) => s !== symptom),
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        // Here you would typically send the data to your backend
        handleStartUpdateToPositive();
    }

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    const handleStartUpdateToPositive = async () => {
        setIsLoading(true);
        try {
            const user_histories = await handleUserHistoryAPI();
            const userIds = await handleRelatedHistory(user_histories);
            await handleNotify({ user_histories, userIds })
            await handleUpdateFinal({ user_histories })
            await queryClient.invalidateQueries({ queryKey: [USERS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })
            setOpen(false)
        } catch (error) {
            console.log({ error })
            toast({ description: `Something went wrong` });
        } finally {
            setIsLoading(false);
        }
    }

    const handleUserHistoryAPI = async () => {

        const { dateOfSymptoms, dateOfTesting, symptoms } = formData;

        console.log({ dateOfSymptoms, dateOfTesting, symptoms: symptoms.join(",") })

        toast({ description: `Finding histories and affected users...` });
        setLoadingMessage(`Finding histories and affected users...`)

        const res1 = await axios.post(`${url}/user-history`, { contactProfileId: contactData.userProfile.id, dateOfSymptoms, dateOfTesting, symptoms: symptoms.join(", ") });
        console.log(res1.data);

        const user_histories = res1.data.values.histories;
        setLoadingMessage(`Please wait, we found ${user_histories.length} history of the user.`)

        return user_histories;
    }

    const handleRelatedHistory = async (user_histories: any) => {
        const res2 = await axios.post(`${url}/related-history`, { user_histories });
        console.log(res2.data);
        const affectedUsers = res2.data.values.affectedUsers

        const userIds: string[] = affectedUsers
            .map((u: any) => {
                if (u.userProfile.status === "NEGATIVE") {
                    console.log(u);
                    return u.id;
                }
            })
            .filter((d: any) => d !== undefined);

        setLoadingMessage(`We found ${userIds.length} affected users to also be processed.`)
        await sleep(1000);
        console.log(userIds)

        return userIds;
    }

    const handleNotify = async ({ userIds, user_histories }: { userIds: any[], user_histories: any[] }) => {
        if (userIds.length > 0) {
            setLoadingMessage(`Sending notifications to affected users...`)

            const res3 = await axios.post(`${url}/notify`, { userIds, diagnosedId: user_histories[0].userId });
            console.log(res3);

            setLoadingMessage(`Making contact tracing record...`)

            const res4 = await axios.post(`${url}/contact-tracing`, { userIds, diagnosedId: user_histories[0].userId, dateOfTesting: formData.dateOfTesting });
            console.log(res4);
        } else {
            setLoadingMessage(`There were no affected users detected from the system.`)
            toast({ title: "No Affected Users", description: `There were no affected users detected from the system.` });
        }
    }

    const handleUpdateFinal = async ({ user_histories }: { user_histories: any[] }) => {
        await sleep(2000);

        setLoadingMessage(`Updating request...`)
        const res5 = await axios.post(`${url}/last`, { userId: user_histories[0].userId, dateOfTesting: formData.dateOfTesting });
        console.log(res5);

        setLoadingMessage(`Success!`)
        toast({ description: "Success!" });
    }

    const resetForm = () => {
        setFormData({
            dateOfSymptoms: "",
            dateOfTesting: "",
            symptoms: [],
            customSymptoms: "",
            medicalImage: null,
        })
    }

    if (isLoading) {
        return <UiLoading type='page' message={loadingMessage} />
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <TestTube className="w-4 h-4 mr-2" />
                    Add COVID-19 Information
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-blue-600" />
                        COVID-19 Information Entry
                    </DialogTitle>
                    <DialogDescription>
                        Please provide your COVID-19 related information. All fields are optional but help us track trends better.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dateOfSymptoms" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date of First Symptoms
                            </Label>
                            <Input
                                id="dateOfSymptoms"
                                type="date"
                                value={formData.dateOfSymptoms}
                                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfSymptoms: e.target.value }))}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfTesting" className="flex items-center gap-2">
                                <TestTube className="w-4 h-4" />
                                Date of Testing
                            </Label>
                            <Input
                                id="dateOfTesting"
                                type="date"
                                value={formData.dateOfTesting}
                                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfTesting: e.target.value }))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Symptoms Section */}
                    <div className="space-y-4">
                        <Label className="text-base font-medium">Symptoms Experienced</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {commonSymptoms.map((symptom) => (
                                <div key={symptom} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={symptom}
                                        checked={formData.symptoms.includes(symptom)}
                                        onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={symptom} className="text-sm font-normal cursor-pointer">
                                        {symptom}
                                    </Label>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customSymptoms">Other Symptoms (describe)</Label>
                            <Textarea
                                id="customSymptoms"
                                placeholder="Describe any other symptoms not listed above..."
                                value={formData.customSymptoms}
                                onChange={(e) => setFormData((prev) => ({ ...prev, customSymptoms: e.target.value }))}
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>

                    {/* Medical Image Upload */}
                    {/* <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Medical Image Upload
                        </Label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {formData.medicalImage ? (
                                <div className="space-y-2">
                                    <div className="text-green-600 font-medium">✓ {formData.medicalImage.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {(formData.medicalImage.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormData((prev) => ({ ...prev, medicalImage: null }))}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Click to upload</span> or drag and drop
                                    </div>
                                    <div className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</div>
                                    <Input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                        className="hidden"
                                        id="fileUpload"
                                    />
                                    <Label htmlFor="fileUpload" className="cursor-pointer">
                                        <Button type="button" variant="outline" size="sm" asChild>
                                            <span>Choose File</span>
                                        </Button>
                                    </Label>
                                </div>
                            )}
                        </div>
                    </div> */}
                </form>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            resetForm()
                            setOpen(false)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                        Save Information
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
