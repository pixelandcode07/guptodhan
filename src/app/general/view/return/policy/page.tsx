import SectionTitle from '@/components/ui/SectionTitle';
import ReturnPolicyForm from './Components/RetunPolicyForm';

const page = () => {
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
        <ReturnPolicyForm />
      </div>
    </div>
  );
};

export default page;
