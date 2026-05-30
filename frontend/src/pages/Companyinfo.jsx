// src/pages/Companyinfo.jsx
import React from "react";
import "./Companyinfo.css";
import {useNavigate} from "react-router-dom"
import lock from "../Assets/lock.png"
import shipping from "../Assets/shipping.png"
import badge from "../Assets/badge.png"
import discount from "../Assets/discount.png"
// src/pages/Companyinfo.jsx


const teamMembers = [
    {
        name: "Amanda Lee",
        role: "Creative Head",
        img: "../Assets/lock.png",
    },
    {
        name: "Lee Stoner",
        role: "Marketing Head",
        img: "/team2.jpg",
    },
    {
        name: "Monica Gala",
        role: "Graphic Designer",
        img: "/team3.jpg",
    },
    {
        name: "Monica Gala",
        role: "Graphic Designer",
        img: "/team3.jpg",
    },
];

const Companyinfo = () => {
    const navigate = useNavigate();
    return (
        <div className="company-wrapper">
            <section className="hero-section">
                <h2>About Us</h2>
                <p>
                    SudoCart is a trusted e-commerce platform offering quality products,
                    secure payments, and fast delivery
                </p>
            </section>

            

            <section className="cta-section">
                <h4>Get Best Offers On Customized Designs!</h4>
                <button onClick={() => navigate("/")} className="cta-button">Get Started</button>
            </section>

            <section className="team-section">
                <h2>Meet Our Creative Team</h2>
                <div className="team-members">
                    {teamMembers.map((member, i) => (
                        <div key={i} className="team-card">
                            <img src={member.img} alt={member.name} />
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="benefits-section">
                <div className="benefits-grid">
                    <div className="benefit-box">
                        <img src={shipping} alt="shipping" />
                        <h4>Worldwide Shipping</h4>
                        <p>We ship all over the globe</p>
                    </div>
                    <div className="benefit-box">
                        <img src={badge} alt="quality" />
                        <h4>Best Quality</h4>
                        <p>Premium quality printing</p>
                    </div>
                    <div className="benefit-box">
                        <img src={discount} alt="discount" />
                        <h4>Best Offers</h4>
                        <p>Attractive discount prices</p>
                    </div>
                    <div className="benefit-box">
                      <img src={lock} alt="secure" />
                        <h4>Secure Payments</h4>
                        <p>Safe & trusted checkout</p>
                    </div>
                </div>
            </section>

           
        </div>
    );
};


  
     

export default Companyinfo;
