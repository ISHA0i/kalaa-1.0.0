import React from 'react';
import '../../../styles/Page.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">About KALAA</h1>
          <p className="lead mb-4">
            Discover the story behind India's premier art marketplace
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="/images/about-mission.jpg"
                alt="Our Mission"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4">Our Mission</h2>
              <p className="lead mb-4">
                At KALAA, we believe in the power of art to transform spaces and inspire lives.
                Our mission is to make authentic Indian art accessible to everyone while
                supporting talented artists across the country.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Supporting local artists and traditional art forms
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Providing a platform for artists to showcase their work
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Making authentic art accessible to art lovers worldwide
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Values</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-heart-fill text-primary display-4 mb-3"></i>
                  <h3 className="card-title h4">Authenticity</h3>
                  <p className="card-text">
                    We ensure every artwork is authentic and original, preserving the
                    integrity of Indian art.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-people-fill text-primary display-4 mb-3"></i>
                  <h3 className="card-title h4">Community</h3>
                  <p className="card-text">
                    We foster a supportive community of artists and art lovers,
                    promoting cultural exchange.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-shield-fill-check text-primary display-4 mb-3"></i>
                  <h3 className="card-title h4">Quality</h3>
                  <p className="card-text">
                    We maintain high standards in artwork curation, packaging, and
                    customer service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Team</h2>
          <div className="row g-4">
            {[1, 2, 3].map((member) => (
              <div key={member} className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <img
                    src={`/images/team-${member}.jpg`}
                    className="card-img-top"
                    alt={`Team Member ${member}`}
                  />
                  <div className="card-body text-center">
                    <h3 className="card-title h5">Team Member {member}</h3>
                    <p className="card-text text-muted">Position</p>
                    <div className="social-links mt-3">
                      <a href="#" className="text-muted me-3">
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a href="#" className="text-muted">
                        <i className="bi bi-twitter"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;