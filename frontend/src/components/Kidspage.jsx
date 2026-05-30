import { useEffect, useState } from 'react';
import Navbar from '../pages/Navbar';
import Productcard from "../pages/Productcard";
import { getProductsByCategory } from '../service/api';

export default function Kidspage() {
  const [kidsProducts, setKidsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKidsProducts();
  }, []);

  const fetchKidsProducts = async () => {
    try {
      const response = await getProductsByCategory('Kids');
      setKidsProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching kids products:', error);
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
    <><Navbar/>
    <div style={{margin:" 2px 10vh 5px 10vh",width:"90%"}}>
        <div className="header">
            <h2>Kids Fashion</h2>
           
          </div>
     <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
    
   
        
             <Productcard products={kidsProducts} />
    
    
    </div>
    
    </div>
    </>
  )
}
