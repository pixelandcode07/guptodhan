import SectionTitle from '@/components/ui/SectionTitle';
import SliderForm from './Components/SliderForm';

export default function Page() {
  return (
    <div className="pt-5 bg-white space-y-4">
      <SectionTitle text="Slider Create Form" />
      <div className="px-5 pt-4">
        <SliderForm />
      </div>
    </div>
  );
}


