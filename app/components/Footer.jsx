export default function Footer() {
    const currentYear = new Date().getFullYear();

  return (
        <footer className="footer">
              <div className="footer-content">
                      <p>© {currentYear} Beau Wisdom. All rights reserved.</p>p>
                      <nav className="footer-nav">
                                <ul>
                                            <li><a href="#about">About</a>a></li>li>
                                            <li><a href="#services">Services</a>a></li>li>
                                            <li><a href="#thoughts">Thoughts</a>a></li>li>
                                            <li><a href="#contact">Contact</a>a></li>li>
                                </ul>ul>
                      </nav>nav>
              </div>div>
        </footer>footer>
      );
}</footer>
