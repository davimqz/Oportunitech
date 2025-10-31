import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>OportuniTech</h3>
          <p>Banco de Dados sobre estágio</p>
        </div>
        
        <div className="footer-section">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="#docs">Relatorio de Formulario</a></li>
          </ul>
        </div>
        
        
      </div>

      <div className="ferramentasContainer">
            <div className="ferramentasBox">
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1761919827/Accenture.svg_dpomrc_ajlzjt.png" alt="" />
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1761774425/AvanadeLogoNoTM_AWColor_RGB_b1kyrp.png" alt="" />
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1759109714/logo3_qcssqr.png" alt="" />
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1759109714/logo1_b5mfdv.png" alt="" />
            </div>
        </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 OportuniTech. Todos os direitos reservados.</p>
      </div>
    </footer>
    </div>
  )
}

export default Footer
