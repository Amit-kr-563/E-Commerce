

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useWatchlist } from "../service/api";

export default function Productcard({ products = [] }) {
  const { addToCart } = useCart();
  const { addToWatchlist } = useWatchlist();
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", padding: "20px 0", boxSizing: "border-box" }}>
      
      {/* Flex-Wrap Grid Layer */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "28px",
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box"
      }}>
        {products.map((item) => (
          
          /* Product Card Container with Custom Patla Border & Soft Shadow */
          <div 
            key={item._id || item.id}
            style={{
              position: "relative",
              width: "265px",
              minHeight: "410px",
              backgroundColor: "#ffffff",
              borderRadius: "20px", // Increased for a softer premium roundness
              border: "1px solid #e2e8f0", // Very thin, elegant soft border
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02)", // Micro shadow
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "#cbd5e1"; // Border darkens slightly on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            
            {/* Watchlist Top Right Button */}
            <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: "5" }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToWatchlist(item);
                }}
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #f1f5f9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
                  alt="Watchlist"
                  style={{ width: "15px", height: "15px", objectFit: "contain" }}
                />
              </button>
            </div>

            {/* Product Image Wrapper */}
            <div style={{ 
              position: "relative", 
              width: "100%", 
              height: "250px", 
              backgroundColor: "#fafafa", 
              overflow: "hidden" 
            }}>
              <img 
                src={item.img} 
                alt={item.name} 
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
              />
              
              {/* Floating Cart Action Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  width: "42px",
                  height: "42px",
                  backgroundColor: "#fcd34d", // Soft luxury gold/amber
                  color: "#0f172a",
                  border: "none",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(252, 211, 77, 0.4)",
                  zIndex: "2",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <i className="fas fa-shopping-cart" style={{ fontSize: "14px" }}></i>
              </button>
            </div>

            {/* Content Info Area with Soft Tint Background */}
            <div style={{ 
              padding: "16px", 
              textAlign: "center", 
              display: "flex", 
              flexDirection: "column", 
              flexGrow: "1", 
              justifyContent: "space-between",
              backgroundColor: "#f8fafc", // Subtle soft color for the details tray
              borderTop: "1px solid #f1f5f9"
            }}>
              <div>
                <h4 style={{ 
                  fontSize: "16px", 
                  fontWeight: "700", 
                  color: "#1e293b", 
                  margin: "0 0 6px 0", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  whiteSpace: "nowrap" 
                }}>
                  {item.name}
                </h4>
                
                {/* Pricing Badges */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>₹{item.price}</span>
                  {item.originalprice && (
                    <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "16px" }}>₹{item.originalprice}</span>
                  )}
                  {item.discount && (
                    <span style={{ 
                      color: "#10b981", 
                      fontWeight: "700", 
                      fontSize: "14px", 
                      backgroundColor: "#dde4e2", 
                      padding: "3px 8px", 
                      borderRadius: "6px",
                      textTransform: "uppercase"
                    }}>
                      {item.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Show More Interactive Action Button */}
              <button
                onClick={() => navigate(`/product/${item._id || item.id}`)}
                style={{
                  width: "100%",
                  backgroundColor: "#10b981", // Solid Emerald Green
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "14px",
                  padding: "11px 0",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.boxShadow = "0 6px 16px rgba(5, 150, 105, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.15)";
                }}
              >
                Show more
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}