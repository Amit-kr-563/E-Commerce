import { Link } from 'react-router-dom';
import './LegalPage.css';

const sections = [
  {
    title: '1. What we collect',
    body: 'We collect only the details needed to process your orders, support your account, and improve the shopping experience. This can include your name, email, mobile number, shipping address, order history, and payment-related metadata.'
  },
  {
    title: '2. How we use it',
    body: 'Your information is used to fulfill orders, manage delivery updates, provide customer support, prevent fraud, and send order-related notifications. We do not sell your personal data to third parties.'
  },
  {
    title: '3. Sharing and storage',
    body: 'We may share information with logistics, payment, and support partners only when it is required to complete a transaction or operate the service. We use reasonable safeguards to protect the data we store.'
  },
  {
    title: '4. Your choices',
    body: 'You can request updates or removal of your account data where applicable, and you can control browser permissions, notifications, and marketing preferences from your device or account settings.'
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <span className="legal-badge">SudoCart • Privacy Policy</span>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-lead">
          We keep your shopping data focused, secure, and transparent. This page explains what we collect,
          how we use it, and the controls you have over your information.
        </p>
        <div className="legal-actions">
          <Link to="/" className="legal-button">Back to Home</Link>
          <Link to="/terms-and-conditions" className="legal-button-secondary">Read Terms & Conditions</Link>
        </div>
      </section>

      <section className="legal-content">
        <div className="legal-grid">
          {sections.map((section) => (
            <article className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <div className="legal-note">
          <strong>Last updated:</strong> June 2026. If you have privacy concerns, contact our support team from the footer’s Contact Us section.
        </div>
      </section>
    </div>
  );
}
