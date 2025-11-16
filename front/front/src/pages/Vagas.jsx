import React, { useEffect, useState } from 'react';

const Vagas = () => {
  const [vagas, setVagas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://oportunitech-1.onrender.com";

  useEffect(() => {
    buscarVagas();
  }, [API_URL, ordenacao]);

  const buscarVagas = () => {
    let url = `${API_URL}/sql/vagas`;
    
    if (ordenacao === 'salario') {
      url = `${API_URL}/sql/vagas/ordenar-salario`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar vagas.");
        }
        return response.json();
      })
      .then((data) => setVagas(data))
      .catch((error) => {
        console.error(error);
        alert("Erro ao buscar vagas.");
      });
  };

  const buscarPorEmpresa = () => {
    if (!searchTerm.trim()) {
      buscarVagas();
      return;
    }

    fetch(`${API_URL}/sql/vagas/empresa/${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar vagas.");
        }
        return response.json();
      })
      .then((data) => setVagas(data))
      .catch((error) => {
        console.error(error);
        alert("Erro ao buscar vagas.");
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      buscarPorEmpresa();
    }
  };

  const handleOrdenacaoChange = (e) => {
    setOrdenacao(e.target.value);
  };

  return (
    <div>
      <div className="empresaContainer">
        <div className="filterContainer">
          <div className="serachFilter">
            <i className="fa-solid fa-magnifying-glass" onClick={buscarPorEmpresa}></i>
            <input 
              type="text" 
              placeholder="Buscar por empresa..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
            />
          </div>
          <div className="filterBox">
            <h1>Filtrar</h1>
            <select value={ordenacao} onChange={handleOrdenacaoChange}>
              <option value="">-</option>
              <option value="salario">Por Salário (Maior)</option>
            </select>
          </div>
        </div>
    

        <div className="rowVagas">
          {vagas.length > 0 ? (
            vagas.map((vaga) => (
              <div key={vaga.cod_vaga} className="vagaContainer">
                <div className="boxContainer">
                  <div className="logoText">
                    <img src={vaga.logo_link} alt="" />
                    <h1>{vaga.titulo}</h1>
                  </div>

                  <p>{vaga.descricao}</p>
                  <p><strong>Carga horária:</strong> {vaga.carga_horaria}h</p>
                  <p><strong>Salário:</strong> R$ {vaga.salario}</p>
                  <div className="buttonVaga">
                    <button>Candidata-se</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma vaga encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vagas;