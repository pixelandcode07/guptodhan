import { Suspense } from 'react';
import LocationPage from '../components/LocationPage';
// import CityPage from './[division]/page';

export default function ParentLocationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LocationPage />
            {/* <CityPage /> */}
        </Suspense>
    );
}