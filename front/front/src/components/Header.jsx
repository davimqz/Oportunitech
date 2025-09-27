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
              <a href="#" className="nav-link">Início</a>
              <a href="#" className="nav-link">Graficos</a>
            </nav>

            {/* Desktop Actions */}
            <div className="actions-desktop">
              <button className="icon-button">
                <User size={20} />
              </button>
              <button className="icon-button">
                <ShoppingCart size={20} />
              </button>
            </div>

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
              <div className="mobile-actions">
                <button className="icon-button">
                  <User size={20} />
                </button>
                <button className="icon-button">
                  <ShoppingCart size={20} />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;