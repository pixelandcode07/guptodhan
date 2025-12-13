import SectionTitle from '@/components/ui/SectionTitle';
import BannerForm from './Components/BannerForm';

export default function Page() {
  return (
    <div className="pt-5 bg-white space-y-4">
      <SectionTitle text="Banner Create Form" />
      <div className="px-5 pt-4">
        <BannerForm />
      </div>
    </div>
  );
}


