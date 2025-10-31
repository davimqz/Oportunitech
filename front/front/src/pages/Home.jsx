import React from 'react'

const Home = () => {
  return (
    <div>
      <div className="welcomeContainer">
        <div className="welcomeBox">
          <div className="welcomeText">
            <h1>Bem vindo à OportuniTech</h1>
            <p>Conectamos estudantes a oportunidades de estágio em empresas parceiras. 
            Explore vagas de diferentes áreas, encontre a oportunidade ideal para seu curso 
            e dê o primeiro passo na sua carreira profissional.</p>
          </div>
          <div className="imageWelcome">
            <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1761922092/equipa-a-trabalhar-em-conjunto-num-projecto_23-2149325411_xmnlix.avif" alt="" />
          </div> 
        </div>
      </div>
    </div>
  )
}

export default Home
