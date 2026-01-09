# Next.js Migration Guide

Your website is now being converted to Next.js! Here's what's been done and what you need to do next.

## Completed ✅

- Created `package.json` with Next.js dependencies
- - Created `next.config.js` for static export configuration
  - - Created `.gitignore` for Node.js projects
    - - Created `app/page.jsx` main page structure
      - - Prepared folder structure for components and styles
       
        - ## Next Steps 📋
       
        - ### 1. Clone and Install
       
        - ```bash
          git clone https://github.com/bwisd91/beausbrain-website.git
          cd beausbrain-website
          npm install
          ```

          ### 2. Create Component Files

          Create these files in the `components/` folder:

          #### `components/Header.jsx`
          ```jsx
          export default function Header() {
            return (
              <header className="header">
                <div className="container nav-container">
                  <h1 className="logo">Beau Wisdom</h1>
                  <nav id="navbar" className="navbar">
                    <ul className="nav-list">
                      <li><a href="#about">About</a></li>
                      <li><a href="#services">Services</a></li>
                      <li><a href="#thoughts">Thoughts</a></li>
                      <li><a href="#credentials">Credentials</a></li>
                      <li><a href="#contact">Contact</a></li>
                    </ul>
                  </nav>
                  <button className="hamburger" id="hamburger">☰</button>
                </div>
              </header>
            );
          }
          ```

          #### `components/Hero.jsx`
          ```jsx
          export default function Hero() {
            return (
              <section className="hero">
                <div className="container">
                  <h2>Behavioral Health Professional & Educator</h2>
                  <p>Empowering learners and professionals through structured guidance, clear communication, and evidence-based support.</p>
                  <a href="#contact" className="btn btn-primary">Get in Touch</a>
                </div>
              </section>
            );
          }
          ```

          #### `components/About.jsx`
          ```jsx
          export default function About() {
            return (
              <section id="about" className="about">
                <div className="container">
                  <div className="about-grid">
                    <img src="professional_headshot.png" alt="Professional portrait of Beau Wisdom" className="about-image" />
                    <div className="about-content">
                      <h2>About Beau</h2>
                      <p>Beau Wisdom is a behavioral health professional and educator with expertise in crisis intervention and youth development. Dedicated to creating meaningful change in vulnerable populations.</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          }
          ```

          #### `components/Services.jsx`
          ```jsx
          export default function Services() {
            const services = [
              { title: "Tutoring & Coaching", description: "Individual and group tutoring in biology, psychology, writing, and study skills." },
              { title: "Academic Writing Support", description: "Guidance through every stage of the writing process from brainstorming to editing." },
              { title: "Professional Documents", description: "Resume, cover letter, and LinkedIn profile development." },
              { title: "Curriculum & Workshop Design", description: "Design of courses, lesson plans, and facilitator guides." },
              { title: "Study Systems Coaching", description: "Non-clinical coaching for organization and follow-through." },
            ];

            return (
              <section id="services" className="services">
                <div className="container">
                  <h2>Services</h2>
                  <div className="services-grid">
                    {services.map((service, index) => (
                      <div key={index} className="service-card">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          ```

          #### `components/Thoughts.jsx`
          ```jsx
          'use client';
          import { useState } from 'react';

          export default function Thoughts() {
            const [expandedArticles, setExpandedArticles] = useState({});

            const articles = [
              { id: 1, date: "January 2026", title: "The Connection Between Structure and Healing", preview: "In residential behavioral health, I've seen how consistent routines and clear expectations create safety for adolescents navigating crisis." },
              { id: 2, date: "January 2026", title: "A New Chapter—And Somehow I'm a Taxi Driver Now", preview: "I'm on the move again—and apparently I'm a taxi driver now. Life has shifted fast." },
              { id: 3, date: "November 2025", title: "Lessons from Teaching Abroad", preview: "Teaching English in Thailand taught me that effective education transcends language." },
            ];

            const toggleArticle = (id) => {
              setExpandedArticles(prev => ({
                ...prev,
                [id]: !prev[id]
              }));
            };

            return (
              <section id="thoughts" className="thoughts">
                <div className="container">
                  <h2>Thoughts</h2>
                  <p>Reflections on behavioral health, education, and professional development.</p>
                  {articles.map(article => (
                    <article key={article.id} className="thought-card">
                      <time>{article.date}</time>
                      <h3>{article.title}</h3>
                      <p>{article.preview}</p>
                      <button className="read-more" onClick={() => toggleArticle(article.id)}>
                        {expandedArticles[article.id] ? 'Show less ←' : 'Read more →'}
                      </button>
                      {expandedArticles[article.id] && (
                        <div className="full-article">
                          {/* Add your full article content here */}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          }
          ```

          #### `components/Credentials.jsx`
          ```jsx
          export default function Credentials() {
            return (
              <section id="credentials" className="credentials">
                <div className="container">
                  <h2>Credentials</h2>
                  <ul>
                    <li>Registered Behavioral Technician (Seattle, 2018)</li>
                    <li>TEFL Certified (GVI Thailand, Dec 2010)</li>
                    <li>Behavioral health experience in crisis prevention and intervention</li>
                    <li>Over a decade of tutoring and curriculum design experience</li>
                  </ul>
                </div>
              </section>
            );
          }
          ```

          #### `components/Contact.jsx`
          ```jsx
          'use client';
          import { useState } from 'react';

          export default function Contact() {
            const [formData, setFormData] = useState({ name: '', email: '', message: '' });

            const handleSubmit = (e) => {
              e.preventDefault();
              console.log('Form submitted:', formData);
              // Add your form submission logic here
            };

            return (
              <section id="contact" className="contact">
                <div className="container">
                  <h2>Contact</h2>
                  <p>Interested in working together? Reach out using the form below.</p>
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required onChange={e => setFormData({...formData, name: e.target.value})} />
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required onChange={e => setFormData({...formData, email: e.target.value})} />
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows="5" required onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                    <button type="submit" className="btn btn-primary">Send Message</button>
                  </form>
                </div>
              </section>
            );
          }
          ```

          #### `components/Footer.jsx`
          ```jsx
          export default function Footer() {
            return (
              <footer>
                <p>&copy; {new Date().getFullYear()} Beau Wisdom. All rights reserved.</p>
              </footer>
            );
          }
          ```

          ### 3. Copy CSS Files

          Copy your existing CSS from the repository:
          - Copy `style.css` → `styles/globals.css`
          - - Copy `thoughts-styles.css` → `styles/thoughts.css`
           
            - ### 4. Create Layout File
           
            - Create `app/layout.jsx`:
            - ```jsx
              import '@/styles/globals.css';
              import '@/styles/thoughts.css';

              export const metadata = {
                title: 'Beau Wisdom – Behavioral & Mental Health Development & Educator',
                description: 'Personal portfolio and thoughts website',
              };

              export default function RootLayout({ children }) {
                return (
                  <html lang="en">
                    <body>{children}</body>
                  </html>
                );
              }
              ```

              ### 5. Add Static Assets

              Create `public/` folder and add:
              - `professional_headshot.png`
              - - Any other images you use
               
                - ### 6. Run Development Server
               
                - ```bash
                  npm run dev
                  ```

                  Visit `http://localhost:3000` to see your site!

                  ### 7. Build for Production

                  ```bash
                  npm run build
                  npm start
                  ```

                  ### 8. Deploy

                  The Next.js workflow (nextjs.yml) is already configured for GitHub Pages deployment. Push your changes and GitHub Actions will automatically build and deploy!

                  ## File Structure

                  ```
                  beausbrain-website/
                  ├── app/
                  │   ├── layout.jsx
                  │   ├── page.jsx
                  │   └── favicon.ico
                  ├── components/
                  │   ├── Header.jsx
                  │   ├── Hero.jsx
                  │   ├── About.jsx
                  │   ├── Services.jsx
                  │   ├── Thoughts.jsx
                  │   ├── Credentials.jsx
                  │   ├── Contact.jsx
                  │   └── Footer.jsx
                  ├── public/
                  │   └── professional_headshot.png
                  ├── styles/
                  │   ├── globals.css
                  │   └── thoughts.css
                  ├── package.json
                  ├── next.config.js
                  ├── .gitignore
                  └── README.md
                  ```

                  ## Need Help?

                  - Next.js Docs: https://nextjs.org/docs
                  - - React Docs: https://react.dev
                    - - GitHub Actions Docs: https://docs.github.com/en/actions
