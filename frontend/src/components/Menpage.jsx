import { useEffect, useState } from 'react';
import Navbar from '../pages/Navbar';
import Productcard from "../pages/Productcard";
import { getProductsByCategory } from '../service/api';

export default function Menpage() {
  const [menProducts, setMenProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenProducts();
  }, []);

  const fetchMenProducts = async () => {
    try {
      const response = await getProductsByCategory('Men');
      setMenProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching men products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar/>
        <div style={{margin:" 2px 10vh 5px 10vh", width:"90%", textAlign:"center"}}>
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
    <Navbar/>
    <div style={{margin:" 2px 10vh 5px 10vh",width:"90%"}}>
        <div className="header">
            <h2>Men's Fashion</h2>
            
          </div>
     <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
 
   <Productcard products={menProducts} />
    
    
    </div>
    
    </div>
    </>
  )
}
