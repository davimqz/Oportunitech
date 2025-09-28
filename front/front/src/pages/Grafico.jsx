import React, { useEffect, useState } from 'react'

const Grafico = () => {

    const [graficos, setGraficos] = useState([]);

    const API_URL = "http://localhost:8080/api";

    useEffect(() => {
        fetch(`${API_URL}/grafico`)
        .then((response) => {
            if (!response.ok) {
            throw new Error("Erro ao buscar itens.");
            }
            return response.json();
        })
        .then((data) => setGraficos(data))
        .catch((error) => {
            console.error(error);
            alert("Erro ao buscar itens.");
        });
    }, []);

  return (
    <div>
      <div className="graficoContainer">
        <div className="cabecalhoGrafico">
            <h1>Graficos</h1>
        </div>
        <div className="graficoBox">
            {/* Barras */}
            <div className="typeGrafico">
                <i class="fa-solid fa-chart-simple fa-2x"></i>
                <h1>Grafico de Barras</h1>
            </div>
            {graficos.length > 0 ? (
                graficos.map((grafico) => (
                <li key={grafico.id}>
                    {grafico.type == "BARRA" && (
                    <div className="graficoIndividual">
                        <div className="graficoIndividualImage">
                            <img src={grafico.image} alt="" />
                        </div>
                        <div className="graficoIndividualInformations">
                            <h1>{grafico.name}</h1>
                            <p>{grafico.description}</p>
                        </div>
                    </div>
                    )}
                </li>
                ))
            ) : (
            <p>Nenhum grafico encontrado.</p>
          )}

        </div>

        <div className="graficoBox">
            {/* Pizza */}
            <div className="typeGrafico">
                <i class="fa-solid fa-chart-pie fa-2x"></i>
                <h1>Grafico de Pizza</h1>
            </div>
            {graficos.length > 0 ? (
                graficos.map((grafico) => (
                <li key={grafico.id}>
                    {grafico.type == "PIZZA" && (
                    <div className="graficoIndividual">
                        <div className="graficoIndividualImage">
                            <img src={grafico.image} alt="" />
                        </div>
                        <div className="graficoIndividualInformations">
                            <h1>{grafico.name}</h1>
                            <p>{grafico.description}</p>
                        </div>
                    </div>
                    )}
                </li>
                ))
            ) : (
            <p>Nenhum grafico encontrado.</p>
          )}

        </div>
      </div>
    </div>
  )
}

export default Grafico
