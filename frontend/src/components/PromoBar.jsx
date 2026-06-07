import React from 'react';
import './PromoBar.css';

export default function PromoBar() {
  const message = '💥 BULK BUY SAVINGS! 💥  Buy 30+ Products → Get 15% OFF  •  Buy 50+ Products → Get 20% OFF  •  The more you shop, the more you save!';

  return (
    <div className="promo-bar">
      <div className="promo-inner">
        <div className="promo-track" aria-hidden>
          <span className="promo-text">{message}</span>
          <span className="promo-text">{message}</span>
        </div>
        <div className="promo-fade left" />
        <div className="promo-fade right" />
      </div>
    </div>
  );
}
