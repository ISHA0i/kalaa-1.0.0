import React from 'react';
import '../../../styles/Page.css';

const Privacy = () => {
  return (
    <div className="privacy-container">
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Privacy Policy</h1>
          <p className="lead mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="privacy-content">
                <h2>Introduction</h2>
                <p>
                  At KALAA, we take your privacy seriously. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit our website or use our
                  services.
                </p>

                <h2>Information We Collect</h2>
                <p>We collect information that you provide directly to us, including:</p>
                <ul>
                  <li>Name and contact information</li>
                  <li>Account credentials</li>
                  <li>Payment information</li>
                  <li>Communication preferences</li>
                  <li>Purchase history</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Process your orders and payments</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our services and website</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>Information Sharing</h2>
                <p>
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul>
                  <li>Service providers who assist in our operations</li>
                  <li>Professional advisers and auditors</li>
                  <li>Law enforcement when required by law</li>
                </ul>

                <h2>Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your
                  personal information. However, no method of transmission over the Internet is 100%
                  secure.
                </p>

                <h2>Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent where applicable</li>
                </ul>

                <h2>Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to improve your browsing experience
                  and analyze website traffic. You can control cookies through your browser settings.
                </p>

                <h2>Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last
                  updated" date.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul>
                  <li>Email: privacy@kalaa.com</li>
                  <li>Phone: +91 11 2345 6789</li>
                  <li>Address: 123 Art Street, New Delhi, India 110001</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy; 