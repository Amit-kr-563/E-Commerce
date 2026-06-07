// import { useEffect, useState } from 'react';
// import { getRandomProducts } from "../service/api";
// import Productcard from "./Productcard";

// export default function Featureitem() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRandomProducts();
//   }, []);

//   const fetchRandomProducts = async () => {
//     try {
//       const response = await getRandomProducts(24);
//       setProducts(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setLoading(false);
//     }
//   };

//   const displayProducts = products.slice(0, 12);

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-sans block clear-both">
      
//       {/* Header Section */}
//       <div className="flex flex-col items-center justify-center text-center mb-10 block">
//         <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight relative after:content-[''] after:block after:w-16 after:h-1 after:bg-emerald-500 after:mx-auto after:mt-3">
//           Featured Items
//         </h2>
//         <p className="text-slate-500 mt-2 text-sm sm:text-base">
//           Explore our top-tier customized premium products curated just for you.
//         </p>
//       </div>

//       {/* Dynamic Loading State (Skeleton Grid) */}
//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse block">
//           {[...Array(8)].map((_, index) => (
//             <div key={index} className="bg-slate-100 rounded-2xl p-4 border border-slate-200/60 flex flex-col gap-4 h-[350px]">
//               <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
//               <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
//               <div className="h-4 bg-slate-200 rounded-md w-full"></div>
//               <div className="flex justify-between items-center mt-auto">
//                 <div className="h-6 bg-slate-200 rounded-md w-1/4"></div>
//                 <div className="h-9 bg-slate-200 rounded-lg w-1/3"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* Isolated Product Section Wrapper to stop structural overflow */
//         <div className="w-full block clear-both relative z-10 overflow-hidden mb-6">
//           <Productcard products={displayProducts} />
//         </div>
//       )}

//       {/* View All Button Section - Forced to render explicitly below the cards */}
//       <div className="w-full flex justify-center items-center pt-8 pb-4 relative z-20 clear-both block">
//         <a 
//           href="/Shop" 
//           className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base font-semibold border-none cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-600/10 hover:-translate-y-0.5 group"
//           style={{ display: 'inline-flex', visibility: 'visible', opacity: 1 }}
//         >
//           <i className="fas fa-th text-sm transition-transform duration-300 group-hover:scale-110"></i> 
//           View All Products
//         </a>
//       </div>

//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { getRandomProducts } from "../service/api";
import Productcard from "./Productcard";

export default function Featureitem() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  const fetchRandomProducts = async () => {
    try {
      const response = await getRandomProducts(24); // Fetch 24 random products
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Display first 12 random products
  const displayProducts = products.slice(0, 12);

  return (
    <div style={{
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      boxSizing: "border-box",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ 
          fontSize: "30px", 
          fontWeight: "800", 
          color: "#0f172a", 
          margin: "0 0 10px 0"
        }}>
          Featured Items
        </h2>
        <div style={{ width: "50px", height: "4px", backgroundColor: "#10b981", margin: "0 auto 15px auto", borderRadius: "2px" }}></div>
        <p style={{ color: "#64748b", fontSize: "15px", margin: "0" }}>
          Explore our top-tier customized premium products curated just for you.
        </p>
      </div>

      {/* Dynamic Loading State (Modern Inline Skeleton) */}
      {loading ? (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          justifyContent: "center",
          width: "100%"
        }}>
          {[...Array(4)].map((_, index) => (
            <div key={index} style={{
              width: "260px",
              height: "380px",
              backgroundColor: "#f1f5f9",
              borderRadius: "16px",
              padding: "15px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "15px"
            }}>
              <div style={{ width: "100%", height: "200px", backgroundColor: "#e2e8f0", borderRadius: "12px" }}></div>
              <div style={{ width: "70%", height: "18px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
              <div style={{ width: "100%", height: "14px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
              <div style={{ width: "40%", height: "24px", backgroundColor: "#e2e8f0", borderRadius: "4px", marginTop: "auto" }}></div>
            </div>
          ))}
        </div>
      ) : (
        /* Actual Product Grid Area */
        <div style={{ width: "100%", display: "block", clear: "both" }}>
          <Productcard products={displayProducts} />
        </div>
      )}

      {/* 🛠️ FORCED INLINE BUTTON SECTION (Ab Har Haal Me Dikhega) */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40px",
        padding: "10px 0",
        clear: "both",
        position: "relative",
        zIndex: "999"
      }}>
        <a 
          href="/Shop" 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 32px",
            backgroundColor: "#10b981", // Brand Match Emerald Green
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
            transition: "all 0.2s ease",
            border: "none",
            visibility: "visible",
            opacity: "1"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#059669";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#10b981";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <i className="fas fa-th" style={{ fontSize: "14px" }}></i> 
          View All Products
        </a>
      </div>

    </div>
  );
}