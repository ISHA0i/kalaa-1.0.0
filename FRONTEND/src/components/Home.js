import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Home.css';

const Home = ({ title = "Artist Are With Admirers", subtitle = "only Artist can give Actual Value of Art" }) => {
  return (
    <div className="home-container">
      <div className="home-content">
        <header className="hero-section bg-primary text-white">
          <div className="container">
            <div className="text-center hero-content">
              <p className="subtitle animate-fade-in">{subtitle}</p>
              <h1 className="display-4 fw-bold animate-slide-up">{title}</h1>
              <div className="cta-buttons animate-fade-in">
                <a href="#featured" className="btn btn-light btn-lg me-3">
                  Explore Art
                </a>
                <a href="#artists" className="btn btn-outline-light btn-lg">
                  Meet Artists
                </a>
              </div>
            </div>
          </div>
        </header>

        <section id="featured" className="featured-section">
          <div className="container">
            <h2 className="section-title text-center mb-5">Featured Artworks</h2>
            <div className="row">
              {[1, 2, 3].map((item) => (
                <div key={item} className="col-md-4 mb-4">
                  <div className="featured-card">
                    <div className="card-placeholder animate-fade-in">
                      <div className="placeholder-content">
                        <h3>Coming Soon</h3>
                        <p>Featured Artwork {item}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="artists" className="artists-section bg-light">
          <div className="container">
            <h2 className="section-title text-center mb-5">Featured Artists</h2>
            <div className="row">
              {[1, 2, 3].map((item) => (
                <div key={item} className="col-md-4 mb-4">
                  <div className="artist-card">
                    <div className="card-placeholder animate-fade-in">
                      <div className="placeholder-content">
                        <h3>Artist Profile</h3>
                        <p>Coming Soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default React.memo(Home);