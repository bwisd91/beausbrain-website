'use client';

export default function Header() {
    return (
          <header>
                <div className="header-container">
                        <h1><a href="/">Beau Wisdom</a></h1>
                        <nav>
                                  <ul>
                                              <li><a href="#about">About</a></li>
                                              <li><a href="#services">Services</a></li>
                                              <li><a href="#thoughts">Thoughts</a></li>
                                              <li><a href="#credentials">Credentials</a></li>
                                              <li><a href="#contact">Contact</a></li>
                                              <li><a href="/plastic-soldiers">Game</a></li>
                                  </ul>
                        </nav>
                        <button className="menu-toggle" aria-label="Toggle menu">☰</button>
                </div>
          </header>
        );
}
