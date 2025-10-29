import React, { useEffect, useState } from 'react'

const Home = () => {

  const [vagas, setVagas] = useState([]);
  const API_URL = "https://oportunitech-1.onrender.com/api" || "http://localhost:8080/api";

  useEffect(() => {
    fetch(`${API_URL}/vagas`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar itens.");
        }
        return response.json();
      })
      .then((data) => setVagas(data))
      .catch((error) => {
        console.error(error);
        alert("Erro ao buscar itens.");
      });
  }, []);

  return (

    
    <div>
        <h1>Home</h1>

        {vagas.map((vaga) => (

        
        <div className="vagaContainer">
          <div className="boxContainer">
              <div className="logoText">
                <h1>{vaga.titulo}</h1>
                <img src={vaga.logoLink} alt="j" />
              </div>
              <p>{vaga.descricao}</p>
              <p>{vaga.empresa}</p>
            
            <div className="buttonVaga">
              <button>Sobre a Vaga</button>
            </div>
          </div>
        </div>
        ))}

      </div>
  )
}

export default Home
