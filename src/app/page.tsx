import BestSell from "./components/BestSell/BestSell";
import Feature from "./components/Feature/Feature";
import FlashSale from "./components/FlashSale/FlashSale";
import Hero from "./components/Hero/Hero";
import JustForYou from "./components/JustForYou/JustForYou";


export default function MainHomePage() {
  return (
    <div>
      <Hero />
      <Feature />
      <FlashSale />
      <BestSell />
      <JustForYou />
    </div>
  )
}

