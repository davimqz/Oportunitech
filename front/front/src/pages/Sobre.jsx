import React from 'react'

const Sobre = () => {
  return (
    <div>
      <div className="infoContainer">
        <div className="infoBox">
            <h1>Sobre o Projeto</h1>
            <p>
                A proposta é desenvolver um sistema de banco de dados para gerenciar oportunidades de estágio oferecidas por 
                empresas parceiras de uma instituição. O sistema deve armazenar informações sobre as empresas, os departamentos responsáveis 
                e as vagas de estágio disponíveis. O objetivo é facilitar a organização e o acesso a essas informações, 
                permitindo que estudantes de diferentes cursos tenham acesso a oportunidades adequadas ao seu perfil.
            </p>
        </div>

        <div className="ferramentasContainer">
            <h1>Sobre as Ferramentas</h1>
            <div className="ferramentasBox">
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1759109714/logo2_qrfink.png" alt="" />
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1759109714/logo4_stgbau.png" alt="" />
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1759109714/logo3_qcssqr.png" alt="" />
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1759109714/logo1_b5mfdv.png" alt="" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Sobre
