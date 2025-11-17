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
           

            <nav className="nav-desktop">
              <div className='logoHeader'>
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1763412984/Imagem_do_WhatsApp_de_2025-11-17_%C3%A0_s_17.55.06_3c978339_gosico.jpg" alt="" />
              </div>
              <div className="headerOption">
                <i class="fa-solid fa-house"></i>
                <a href="/" className="nav-link">Início</a>
              </div>
              <div className="headerOption">
                <i class="fa-solid fa-server"></i>
                <a href="/visualizar" className="nav-link">Visualizar</a>
              </div>
              <div className="headerOption">
                <i class="fa-solid fa-server"></i>
                <a href="/jbdc" className="nav-link">JBDC</a>
              </div>
               <div className="headerOption">
                <i class="fa-solid fa-server"></i>
                <a href="/sql" className="nav-link">SQL</a>
              </div>
              <div className="headerOption">
                <i class="fa-solid fa-suitcase"></i>
                <a href="/vagas" className="nav-link">Vagas</a>
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
              <a href="/" className="mobile-nav-link">Início</a>
              <a href="/graficos" className="mobile-nav-link">Graficos</a>
              <a href="/sobre" className="mobile-nav-link">Sobre o Projeto</a>
              <a href="/visualizar" className="mobile-nav-link">Visualizar SQL</a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;