
import Feature from '../pages/Feature';
import Footer from '../pages/Footer';
import Navbar from '../pages/Navbar';
import Slider from '../pages/Slider';
import Featureitem from '../pages/Featureitem';
import PromoBar from './PromoBar';
export default function Homepage() {
  return (
    <>
    <Navbar/>
        <Slider/>
        <PromoBar />
        <Feature/>
        <Featureitem/>
        <Footer/>
  
    </>
  )
}
