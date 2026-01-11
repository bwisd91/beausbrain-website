'use client';

import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
          name: '',
          email: '',
          message: ''
    });

  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
                ...prev,
                [name]: value
        }));
  };

  const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Form submission logic here
  };

  return (
        <section className="contact" id="contact">
              <h2>Contact</h2>h2>
              <p>Interested in working together? Reach out using the form below.</p>p>
              <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-group">
                                <label htmlFor="name">Name</label>label>
                                <input
                                              type="text"
                                              id="name"
                                              name="name"
                                              value={formData.name}
                                              onChange={handleChange}
                                              required
                                            />
                      </div>div>
                      <div className="form-group">
                                <label htmlFor="email">Email</label>label>
                                <input
                                              type="email"
                                              id="email"
                                              name="email"
                                              value={formData.email}
                                              onChange={handleChange}
                                              required
                                            />
                      </div>div>
                      <div className="form-group">
                                <label htmlFor="message">Message</label>label>
                                <textarea
                                              id="message"
                                              name="message"
                                              value={formData.message}
                                              onChange={handleChange}
                                              required
                                              rows="5"
                                            />
                      </div>div>
                      <button type="submit" className="submit-button">Send Message</button>button>
              </form>form>
        </section>section>
      );
}</section>
