import SectionTitle from '@/components/ui/SectionTitle';
import ShipingForm from './Components/ShipingForm';

const page = () => {
  return (
    <div className="bg-white pt-5 ">
      <SectionTitle text="Shipping Policy Update Form" />
      <div className="p-5 pt-0">
        <p
          className="pb-2
        ">
          Write Shipping Policies Here :
        </p>
        <ShipingForm />
      </div>
    </div>
  );
};

export default page;
