import SectionTitle from '@/components/ui/SectionTitle';
import PrivacyForm from './Components/PrivacyForm';

export default function Page() {
  return (
    <div className="bg-white pt-5 ">
      <SectionTitle text="Privacy Policy Update Form" />
      <div className="p-5 pt-0">
        <p
          className="pb-2
        ">
          Write Privacy Policies Here :
        </p>
        <PrivacyForm />
      </div>
    </div>
  );
}
