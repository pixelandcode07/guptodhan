import SectionTitle from '@/components/ui/SectionTitle';
import PrivacyForm from './Components/PrivacyForm';
import { PrivacyPolicyServices } from '@/lib/modules/privacy-policy/privacy-policy.service';



export default async function Page() {
  const initialData = await PrivacyPolicyServices.getPublicPolicyFromDB();

  return (
    <div className="bg-white pt-5">
      <SectionTitle text="Privacy Policy Update Form" />
      <div className="p-5 pt-0">
        <p className="pb-2">Write Privacy Policy Here :</p>
        <PrivacyForm initialData={initialData || undefined} />
      </div>
    </div>
  );
}

export const revalidate = 0;