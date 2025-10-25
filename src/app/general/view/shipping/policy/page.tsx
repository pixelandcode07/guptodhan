import SectionTitle from '@/components/ui/SectionTitle';
import ShipingForm from './Components/ShipingForm';
import { ShippingPolicyServices } from '@/lib/modules/shipping-policy/shipping-policy.service';

const page = async () => {
  const initialData = await ShippingPolicyServices.getPublicPolicyFromDB();
  return (
    <div className="bg-white pt-5 ">
      <SectionTitle text="Shipping Policy Update Form" />
      <div className="p-5 pt-0">
        <p
          className="pb-2
        ">
          Write Shipping Policies Here :
        </p>
        <ShipingForm initialData={JSON.parse(JSON.stringify(initialData))} />
      </div>
    </div>
  );
};

export default page;
