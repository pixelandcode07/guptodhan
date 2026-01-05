// 'use client';


import Footerbanner from "./components/Footerbanner";
import FooterFoot from "./components/FooterFoot";
import FooterLinks from "./components/FooterLinks";
import MobileFooter from "./components/MobileFooter";



export default function HomeFooter() {


  return (
    <>
      {/* Mobile Footer*/}
      <div className="md:hidden">
        <MobileFooter />
      </div>

      {/* Desktop Footer */}
      <div className=" hidden md:block">
        {/* container mx-auto */}
        <Footerbanner />
        <FooterLinks />
        <FooterFoot />
      </div>
    </>
  );
}
