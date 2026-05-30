

import "./Feature.css"

import  men from "./menfashion.png"
import  women from "./womenfashion.png"

export default function Feature() {
 
  return (
    <>
    <div className="featured-section">
    <h2>Featured Categories</h2>
    <div className="categories">
      <div className="card">
        <img src={men} alt="Men Fashion"/>
       <div className="shop-btn" ><a href="/Menpage"  style={{textDecoration:"none",
  color: "black"}}>SHOP NOW </a></div>
      </div>
      <div className="card">
        <img src={women} alt="Women Fashion"/>
        <div className="shop-btn"  ><a href="/Womenpage"  style={{textDecoration:"none",
  color: "black"}}>SHOP NOW </a></div>
      </div>
      <div className="card">
        <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9" alt="Kids Fashion"/>
        <div className="shop-btn" ><a href="/Kidspage"  style={{textDecoration:"none",
  color: "black"}}>SHOP NOW </a></div>
      </div>
    </div>
    </div>
  </>

  )
}
