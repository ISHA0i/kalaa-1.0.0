import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../../../styles/Page.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
          <p className="lead mb-4">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="subject" className="form-label">Subject</label>
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="message" className="form-label">Message</label>
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100"
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-geo-alt text-primary display-4 mb-3"></i>
                <h3 className="h4">Address</h3>
                <p className="mb-0">123 Art Street</p>
                <p>New Delhi, India 110001</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-envelope text-primary display-4 mb-3"></i>
                <h3 className="h4">Email</h3>
                <p className="mb-0">info@kalaa.com</p>
                <p>support@kalaa.com</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-telephone text-primary display-4 mb-3"></i>
                <h3 className="h4">Phone</h3>
                <p className="mb-0">+91 11 2345 6789</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;