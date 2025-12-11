
import { JustForYou } from './JustForYou';
import { fetchJustForYouData } from '@/lib/MainHomePage/fetchJustForYouData';

export default async function JustForYouWrapper() {
    const initialProducts = await fetchJustForYouData();
    return <JustForYou initialProducts={initialProducts} />;
}
