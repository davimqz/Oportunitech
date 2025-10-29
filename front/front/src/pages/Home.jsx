import React, { useEffect, useState } from 'react'

const Home = () => {

  const [vagas, setVagas] = useState([]);
  const API_URL = "https://oportunitech-1.onrender.com/api" || "http://localhost:8080/api";

  useEffect(() => {
    fetch(`${API_URL}/api/vagas`)
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

        <div className="vagaContainer">
          <div className="boxContainer">
              <div className="logoText">
                <h1>Nome Vaga</h1>
                <img src="" alt="j" />
              </div>
              <p>Nome Empresa</p>
            
            <div className="buttonVaga">
              <button>Sobre a Vaga</button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Home
