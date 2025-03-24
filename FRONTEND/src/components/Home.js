import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/Home.css';
import Isha from './Photo/Isha.jpg';
import Tanvi from './Photo/Tanvi.jpg';
import Riddhi from './Photo/Riddhi.jpg';
import Drashti from './Photo/Drashti.jpg';
const Home = ({ title = "Artists Are With Admirers", subtitle = "Only Artists Can Give Actual Value to Art" }) => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const fetchFeaturedData = async () => {
    try {
      // Attempt to fetch data from the backend
      const artworksResponse = await fetch('http://localhost:5002/api/featured-artworks');
      const artistsResponse = await fetch('http://localhost:5002/api/featured-artists');

      if (!artworksResponse.ok || !artistsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const artworksData = await artworksResponse.json();
      const artistsData = await artistsResponse.json();

      setFeaturedArtworks(artworksData);
      setFeaturedArtists(artistsData);
    } catch (error) {
      console.error('Error fetching data:', error);

      // Fallback data for Featured Artworks
      setFeaturedArtworks([
        {
          id: '1',
          title: 'Handmade Painting',
          description: 'A beautiful handmade painting.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6czBCdEXZnTFS5lhsUpGKrnjD53ajML6BrQ&s'
        },
        {
          id: '2',
          title: 'Digital Artwork',
          description: 'A stunning piece of digital artwork.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqIKJvid0P8UOaiJrFNqbvEXxq66621HA-DA&s'
        },
        {
          id: '3',
          title: 'Sculpture',
          description: 'An elegant sculpture for your home.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcxANkTJxu07KiU2s5vsh70Jl-u7uJrdvoyA&s'
        }
      ]);

      // Fallback data for Featured Artists
      setFeaturedArtists([
        {
          id: '1',
          name: 'Isha Chovatiya',
          bio: 'A talented artist specializing in handmade paintings.',
          image: Isha
        },
        {
          id: '2',
          name: 'Tanvi Khokhariya',
          bio: 'An expert in digital artwork and creative designs.',
          image: Tanvi
        },
        {
          id: '3',
          name: 'Riddhi Khokhariya',
          bio: 'A sculptor known for elegant and intricate sculptures.',
          image: Riddhi
        },
        {
          id: '4',
          name: 'Drashti Radadiya',
          bio: 'A versatile artist with a passion for various art forms.',
          image: Drashti
        }
      ]);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Hero Section */}
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

        {/* Featured Artworks Section */}
        <section id="featured" className="featured-section">
          <div className="container">
            <h2 className="section-title text-center mb-5">Featured Artworks</h2>
            <div className="row">
              {featuredArtworks.map((artwork) => (
                <div key={artwork.id} className="col-md-4 mb-4">
                  <div className="featured-card">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="card-img-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="card-body">
                      <h3 className="card-title">{artwork.title}</h3>
                      <p className="card-text">{artwork.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artists Section */}
        <section id="artists" className="artists-section bg-light">
          <div className="container">
            <h2 className="section-title text-center mb-5">Featured Artists</h2>
            <div className="row">
              {featuredArtists.map((artist) => (
                <div key={artist.id} className="col-md-4 mb-4">
                  <div className="artist-card">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="card-img-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="card-body">
                      <h3 className="card-title">{artist.name}</h3>
                      <p className="card-text">{artist.bio}</p>
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