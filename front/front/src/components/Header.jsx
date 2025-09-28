import React, { useState } from 'react';
import { Menu, X, User, ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div>
              <a href="#" className="logo">OportuniTech</a>
            </div>

            <nav className="nav-desktop">
              <div className="headerOption">
                <i class="fa-solid fa-house"></i>
                <a href="/" className="nav-link">Início</a>
              </div>
              <div className="headerOption">
                <i class="fa-solid fa-chart-simple"></i>
                <a href="/graficos" className="nav-link">Graficos</a>
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="menu-button"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <a href="#" className="mobile-nav-link">Início</a>
              <a href="#" className="mobile-nav-link">Graficos</a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;