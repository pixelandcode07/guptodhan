import React, { Suspense } from 'react' // Suspense import korun
import DonationHome from './components/DonationHome'

export default function DonationHomePage() {
    return (
        <div>
            {/* fallback hisebe loading message dekhano hocche */}
            <Suspense fallback={<div>Loading Page...</div>}>
                <DonationHome />
            </Suspense>
        </div>
    )
}