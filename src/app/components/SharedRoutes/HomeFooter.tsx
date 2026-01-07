
import FooterComplete from "./components/FooterComplete";
import MobileFooter from "./components/MobileFooter";



export default function HomeFooter() {


  return (
    <>
      {/* Mobile Footer*/}
      <div className="md:hidden">
        <MobileFooter />
      </div>

      {/* Desktop Footer */}
      <div className=" hidden md:block ">
        <FooterComplete />
      </div>
    </>
  );
}
