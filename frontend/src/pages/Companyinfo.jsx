// src/pages/Companyinfo.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import amitk from "../Assets/amitk.png";
import modi from "../Assets/modi.jpeg";
import badge from "../Assets/badge.png";
import discount from "../Assets/discount.png";

const teamMembers = [
    {
        name: "Amit Kumar",
        role: "Creative Head",
        img: amitk, 
    },
    {
        name: "Dharmendra Kumar",
        role: "Marketing Head",
        img: modi,
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
        <div style={{ backgroundColor: "#fafafa", color: "#334155", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>
            
            {/* 1. Subtle Pastel Hero Section */}
            <section style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)", // Light Mint to Light Blue
                color: "#1e293b",
                textAlign: "center",
                padding: "70px 20px",
                borderBottomRightRadius: "24px",
                borderBottomLeftRadius: "24px",
                borderBottom: "1px solid #e2e8f0"
            }}>
                <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "15px", color: "#0f172a", letterSpacing: "-0.5px" }}>
                    About SudoCart
                </h2>
                <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "16px", color: "#475569", lineHeight: "1.6" }}>
    A premium e-commerce platform for custom designs, secure payments, and fast global shipping—offering exclusive tiered discounts on bulk orders.
</p>
            </section>

            {/* 2. Soft & Creamy CTA Banner (Replaced Bright Yellow) */}
            <section style={{
                background: "#fef3c7", // Soft pastel cream/amber
                color: "#1e293b",
                textAlign: "center",
                padding: "30px 20px",
                maxWidth: "1000px",
                margin: "-25px auto 40px auto",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(254, 243, 199, 0.5)",
                border: "1px solid #fde68a",
                position: "relative",
                zIndex: "10"
            }}>
                <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#78350f" }}>
                    ✨ Get Best Offers On Customized Designs!
                </h4>
                <button 
                    onClick={() => navigate("/")} 
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#1e293b",
                        fontWeight: "600",
                        fontSize: "14px",
                        padding: "10px 28px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "50px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f8fafc";
                        e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#ffffff";
                        e.target.style.transform = "translateY(0)";
                    }}
                >
                    Explore Shop
                </button>
            </section>

           
                    
                   {/* 3. Core Features / Benefits Grid */}
            <section style={{ padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center"
                }}>
                    
                    {/* Box 1 - Soft Light Blue */}
                    <div style={{ ...boxStyle, backgroundColor: "#f0f9ff", border: "1px solid #e0f2fe" }}>
                        <div style={{ ...iconCircleStyle, backgroundColor: "#e0f2fe" }}>
                            <img src={shipping} alt="shipping" style={{height: "22px"}} />
                        </div>
                        <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#0369a1" }}>Worldwide Shipping</h4>
                        <p style={{ fontSize: "13px", color: "#0369a1", opacity: 0.8, lineHeight: "1.5" }}>Express tracking nodes across the entire globe.</p>
                    </div>

                    {/* Box 2 - Soft Mint Green */}
                    <div style={{ ...boxStyle, backgroundColor: "#f0fdf4", border: "1px solid #dcfce7" }}>
                        <div style={{ ...iconCircleStyle, backgroundColor: "#dcfce7" }}>
                            <img src={badge} alt="quality" style={{height: "22px"}} />
                        </div>
                        <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#15803d" }}>Premium Quality</h4>
                        <p style={{ fontSize: "13px", color: "#15803d", opacity: 0.8, lineHeight: "1.5" }}>Industry-grade fabrics & high-fidelity crisp prints.</p>
                    </div>

                    {/* Box 3 - Soft Warm Amber/Cream */}
                    <div style={{ ...boxStyle, backgroundColor: "#fffbeb", border: "1px solid #fef3c7" }}>
                        <div style={{ ...iconCircleStyle, backgroundColor: "#fef3c7" }}>
                            <img src={discount} alt="discount" style={{height: "22px"}} />
                        </div>
                        <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#b45309" }}>Bulk Discounts</h4>
                        <p style={{ fontSize: "13px", color: "#b45309", opacity: 0.8, lineHeight: "1.5" }}>Massive wholesale tiered pricing for large orders.</p>
                    </div>

                    {/* Box 4 - Soft Lavender/Purple */}
                    <div style={{ ...boxStyle, backgroundColor: "#faf5ff", border: "1px solid #f3e8ff" }}>
                        <div style={{ ...iconCircleStyle, backgroundColor: "#f3e8ff" }}>
                            <img src={lock} alt="secure" style={{height: "22px"}} />
                        </div>
                        <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#6b21a8" }}>Secure Standard</h4>
                        <p style={{ fontSize: "13px", color: "#6b21a8", opacity: 0.8, lineHeight: "1.5" }}>End-to-end tokenized online payment execution.</p>
                    </div>

                </div>
            </section>

            {/* 4. Creative Team Section */}
            <section style={{ padding: "50px 20px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
                <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "40px", color: "#0f172a" }}>
                    Meet Our Creative Visionaries
                </h2>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "24px",
                    justifyContent: "center"
                }}>
                    {teamMembers.map((member, i) => (
                        <div key={i} style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            padding: "24px",
                            width: "210px",
                            textAlign: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                            border: "1px solid #f1f5f9"
                        }}>
                            <img 
                                src={member.img} 
                                alt={member.name} 
                                style={{
                                    width: "110px",
                                    height: "110px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    margin: "0 auto 15px auto",
                                    border: "3px solid #f8fafc",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                                }}
                            />
                            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>
                                {member.name}
                            </h3>
                            <p style={{ fontSize: "13px", color: "#059669", fontWeight: "500" }}>
                                {member.role}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// Reusable styling configurations for cards
const boxStyle = {
    backgroundColor: "#ffffff",
    padding: "25px 20px",
    borderRadius: "16px",
    width: "230px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
    border: "1px solid #f1f5f9",
    flexGrow: "1"
};

const iconCircleStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#f0fdf4", // Lightest mint background for icons
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px auto",
    border: "1px solid #e8f5e9"
};

export default Companyinfo;