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

export function TermsModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                    By clicking continue, you agree to our <span>Terms of Service</span>{" "}
                    and <span>Privacy Policy</span>.
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[360px] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Terms and Conditions</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <h1 className="font-medium">Privacy Policy</h1>
                        <h2 className="text-xs text-muted-foreground">This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                            We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the Privacy Policy Template.
                        </h2>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="font-medium">Use of Your Personal Data</h1>
                        <h2 className="text-xs text-muted-foreground">The Company may use Personal Data for the following purposes:
                            <br />
                            •	To provide and maintain our Service, including to monitor the usage of our Service.
                            <br />
                            •	To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.
                            <br />
                            •	For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.
                            <br />
                            •	To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application&apos;s push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.
                            <br />
                            •	To manage Your requests: To attend and manage Your requests to Us.
                            <br />
                            •	For business transfers: We may use Your information to evaluate or conduct a merger,
                            <br />
                            •	For other purposes: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.
                            <br />
                            <br />
                            We may share Your personal information in the following situations:
                            <br />
                            •	With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.
                            <br />
                            •	With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.
                            <br />
                            •	With other users: when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.
                            <br />
                            •	With Your consent: We may disclose Your personal information for any other purpose with Your consent.
                        </h2>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="font-medium">Retention of Your Personal Data</h1>
                        <h2 className="text-xs text-muted-foreground">The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                            <br />
                            The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
                        </h2>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="font-medium">Transfer of Your Personal Data</h1>
                        <h2 className="text-xs text-muted-foreground">Your information, including Personal Data, is processed at the Company&apos;s operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.
                            Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.
                            The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.

                        </h2>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="font-medium">Disclosure of Your Personal Data</h1>
                        <h2 className="text-xs text-muted-foreground">
                            If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
                            <br />
                            Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
                            <br />
                            The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
                            <br />
                            •	Comply with a legal obligation
                            <br />
                            •	Protect and defend the rights or property of the Company
                            <br />
                            •	Prevent or investigate possible wrongdoing in connection with the Service
                            <br />
                            •	Protect the personal safety of Users of the Service or the public
                            <br />
                            •	Protect against legal liability
                        </h2>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="font-medium">Security of Your Personal Data</h1>
                        <h2 className="text-xs text-muted-foreground">The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                        </h2>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="font-medium">Children&apos;s Privacy</h1>
                        <h2 className="text-xs text-muted-foreground">Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
                            If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent&apos;s consent before We collect and use that information.
                        </h2>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="font-medium">Collecting and Using Your Personal Data</h1>
                        <h2 className="text-xs text-muted-foreground">While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                            <br />
                            •	Email address
                            <br />
                            •	First name and last name
                            <br />
                            •	Phone number
                            <br />
                            •	Location
                            <br />
                            •	Usage Data
                            <br />
                            <br />
                            Usage Data is collected automatically when using the Service.
                            Usage Data may include information such as Your Device&apos;s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                            When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                            We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
                        </h2>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
