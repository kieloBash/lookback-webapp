import { currentUser } from '@/lib/auth';
import { ILayoutProps } from '@/types/global'
import { redirect } from 'next/navigation';

const OnboardedLayout = async ({ children }: ILayoutProps) => {
    const user = await currentUser();

    if (!user?.isOnboarded) redirect("/onboarding");


    return <>{children}</>
}

export default OnboardedLayout