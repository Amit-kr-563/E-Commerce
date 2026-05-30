import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-part">
           <div className="footer-section">
            <h3> SudoCart</h3>
             <div className="social-icons">
              <a href="https://x.com/Amit34394836"><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/amit_kr_563/"><i className="fab fa-instagram"></i></a>
             <a href="https://www.linkedin.com/in/amit-kumar-ab24602a4/"><i class="fa-brands fa-linkedin"></i></a>
             <a href="https://github.com/Amit-kr-563"><i class="fa-brands fa-github"></i></a>
            
            </div>
          </div>
          

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul>
              <li><i className="fas fa-phone-alt"></i> +91 9523599608</li>
              <li><i className="fas fa-envelope"></i> sudocart.com</li>
              <li><i className="fas fa-map-marker-alt"></i> Buxar, Bihar</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Important Links</h3>
            
            <ul>
              <li><a href="/aboutus">About Us</a></li>
               <li><a href="/contect">Let's Connect</a></li>
              <li><a href="#">Privacy Policy</a></li>
             
              <li><a href="#">Terms &  Conditions</a></li>
            </ul>
        
          </div>
        </div>

        <div className="Copyright">
          <p><i className="fa-regular fa-copyright"></i>
            2025 SUDOCART. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
