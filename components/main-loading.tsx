import { Loader2, Activity } from "lucide-react"

export default function MainLoadingPage({ message }: { message?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-md w-full">
                {/* Logo/Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="p-3 bg-primary rounded-full">
                            <Activity className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">LookBack</h1>
                    </div>
                    <p className="text-gray-600 text-lg">COVID Tracker</p>
                </div>

                {/* Loading Animation */}
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    </div>

                    {/* Loading Text */}
                    <div className="space-y-2">
                        <p className="text-gray-700 font-medium">Loading...</p>
                        <p className="text-gray-500 text-sm">{message ? message : "Sit back and relax"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
