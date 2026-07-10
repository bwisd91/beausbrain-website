export default function Footer() {
    const currentYear = new Date().getFullYear();

  return (
        <footer className="footer">
              <div className="footer-content">
                      <p>© {currentYear} Beau Wisdom. All rights reserved.</p>
                      <nav className="footer-nav">
                                <ul>
                                            <li><a href="#about">About</a></li>
                                            <li><a href="#services">Services</a></li>
                                            <li><a href="#thoughts">Thoughts</a></li>
                                            <li><a href="#contact">Contact</a></li>
                                </ul>
                      </nav>
              </div>
        </footer>
      );
}
