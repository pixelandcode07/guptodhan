import { Suspense } from 'react';
import LocationPage from '../components/LocationPage';

export default function ParentLocationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LocationPage />
        </Suspense>
    );
}