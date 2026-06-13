


// import slider5 from "../Assets/Slider/slider5.jpg";
// import slider6 from "../Assets/Slider/slider6.jpg";
// import slider4 from "../Assets/Slider/slider4.jpg";

// export default function Slider() {
//   return (
//     <div id="carouselExample" className="carousel slide">

//       <div className="carousel-inner">

//         <div className="carousel-item active">
//           <img src={slider5} className="d-block w-100" alt="slide 1" />
//         </div>

//         <div className="carousel-item">
//           <img src={slider6} className="d-block w-100" alt="slide 2" />
//         </div>

//         <div className="carousel-item">
//           <img src={slider4} className="d-block w-100" alt="slide 3" />
//         </div>

//       </div>

//       <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
//         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Previous</span>
//       </button>

//       <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
//         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Next</span>
//       </button>

//     </div>
//   );
// }


import React from "react";
import slider5 from "../Assets/Slider/slider5.jpg";
import slider6 from "../Assets/Slider/slider6.jpg";
import slider4 from "../Assets/Slider/slider4.jpg";

export default function Slider() {
  return (
    /* यहाँ हमने data-bs-ride और data-bs-interval जोड़ दिया है */
    <div 
      id="carouselExample" 
      className="carousel slide" 
      data-bs-ride="carousel" 
      data-bs-interval="3000" 
      style={{ overflow: "hidden" }}
    >
      
      <style>{`
        .custom-slider-img {
          height: 500px;
          object-fit: cover;
          object-position: center;
          width: 100%;
        }

        @media (max-width: 768px) {
          .custom-slider-img {
            height: 280px;
          }
        }
      `}</style>

      <div className="carousel-inner">

        <div className="carousel-item active">
          <img 
            src={slider5} 
            className="d-block custom-slider-img" 
            alt="slide 1" 
          />
        </div>

        <div className="carousel-item">
          <img 
            src={slider6} 
            className="d-block custom-slider-img" 
            alt="slide 2" 
          />
        </div>

        <div className="carousel-item">
          <img 
            src={slider4} 
            className="d-block custom-slider-img" 
            alt="slide 3" 
          />
        </div>

      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>

    </div>
  );
}