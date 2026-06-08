import { Link } from 'react-router-dom';
import './LegalPage.css';

const sections = [
  {
    title: '1. Using the store',
    body: 'By browsing or purchasing from SudoCart, you agree to use the platform lawfully and to provide accurate account and order information when required.'
  },
  {
    title: '2. Orders and fulfillment',
    body: 'Product availability, delivery timelines, and order status updates are based on seller inventory and logistics partners. We can cancel or correct orders when there is a pricing, stock, or fraud issue.'
  },
  {
    title: '3. Payments and refunds',
    body: 'Payments must be completed through approved checkout methods. Refunds, if applicable, are processed according to the order status, product condition, and our support review process.'
  },
  {
    title: '4. Account responsibility',
    body: 'You are responsible for maintaining the security of your account credentials and for reviewing any updates we send regarding your order or account activity.'
  }
];

export default function TermsConditions() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <span className="legal-badge">SudoCart • Terms & Conditions</span>
        <h1 className="legal-title">Terms & Conditions</h1>
        <p className="legal-lead">
          These terms define how SudoCart works for shoppers and sellers, including account use, orders,
          payments, refunds, and service limits.
        </p>
        <div className="legal-actions">
          <Link to="/" className="legal-button">Back to Home</Link>
          <Link to="/privacy-policy" className="legal-button-secondary">Read Privacy Policy</Link>
        </div>
      </section>

      <section className="legal-content">
        <div className="legal-stack">
          <div className="legal-grid">
            {sections.map((section) => (
              <article className="legal-card" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </article>
            ))}
          </div>

          <article className="legal-card">
            <h2>Service updates</h2>
            <p>
              We may update these terms from time to time. Continued use of the site after changes means you accept the latest version.
              For questions, contact us using the support details in the footer.
            </p>
          </article>
        </div>

        <div className="legal-note">
          <strong>Last updated:</strong> June 2026. Please review these terms before placing orders or registering as a seller.
        </div>
      </section>
    </div>
  );
}
