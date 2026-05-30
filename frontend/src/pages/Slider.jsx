import slider from "../Assets/Slider/slider.jpg"
import image from "../Assets/Slider/image.png"
import slider1 from "../Assets/Slider/slider1.jpg"
import slider3 from "../Assets/Slider/slider3.jpg"

export default function Slider() {
  return (
   <><div id="carouselExample" class="carousel slide">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src={image} class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={slider1} class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={slider3} class="d-block w-100" alt="..."/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
   </>
  )
}
