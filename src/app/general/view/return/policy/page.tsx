import SectionTitle from '@/components/ui/SectionTitle';
import ReturnPolicyForm from './Components/RetunPolicyForm';
import dbConnect from '@/lib/db';
import { ReturnPolicyServices } from '@/lib/modules/return-policy/return-policy.service';

const page = async () => {
  await dbConnect();
  const initialData = await ReturnPolicyServices.getPublicPolicyFromDB();

  return (
    <div className="bg-white pt-5 ">
      <SectionTitle
        text="Return Policy Update Form
"
      />
      <div className="p-5 pt-0">
        <p
          className="pb-2
        ">
          Write Return Policies Here :
        </p>

        <ReturnPolicyForm
          initialData={initialData || undefined}
        />
      </div>
    </div>
  );
};

export default page;
