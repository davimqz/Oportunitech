import React, { useEffect, useState } from 'react'

const Grafico = () => {

    const [graficos, setGraficos] = useState([]);

    // const API_URL = "https://oportunitech.onrender.com/api";
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
            <div className="graficosTypes">
                <div className="boxType">
                    <a href="#barras">
                    <i class="fa-solid fa-chart-simple"></i>
                    <p>Barras</p></a>
                </div>
                <div className="boxType">
                    <a href="#pizza">
                    <i class="fa-solid fa-chart-pie"></i>
                    <p>Pizza</p></a>
                </div>
                <div className="boxType">
                    <a href="#dispercao">
                    <i class="fa-solid fa-chart-line"></i>
                    <p>Disperção</p></a>
                </div>
            </div>
        </div>
        <div className="baixarExelContainer">
            <div className="exelBox">
                <i class="fa-solid fa-download"></i>
                <p>Baixar Relatorio</p>
            </div>
        </div>
        <div className="graficoBox" id='barras'>
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

        <div className="graficoBox" id='pizza'>
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

        <div className="graficoBox" id='dispercao'>
            {/* Pizza */}
            <div className="typeGrafico">
                <i class="fa-solid fa-chart-line fa-2x"></i>
                <h1>Grafico de Disperção</h1>
            </div>
            {graficos.length > 0 ? (
                graficos.map((grafico) => (
                <li key={grafico.id}>
                    {grafico.type == "DISPERSAO" && (
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
