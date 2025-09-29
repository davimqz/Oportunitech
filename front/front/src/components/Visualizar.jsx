import React, { useEffect, useState } from 'react';

const API_URL = "https://oportunitech.onrender.com/sql";

const Visualizar = () => {
  const [tabelas, setTabelas] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  // Buscar as tabelas ao carregar
  useEffect(() => {
    fetch(`${API_URL}/tables`)
      .then(res => res.json())
      .then(data => {
        console.log("Tabelas:", data);
        setTabelas(data);
      })
      .catch(err => console.error("Erro ao buscar tabelas:", err));
  }, []);

  // Buscar os dados da tabela selecionada
  const carregarDados = async (nomeTabela) => {
    if (!nomeTabela) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: `SELECT * FROM ${nomeTabela}` })
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!response.ok) {
        throw new Error(data);
      }

      setDados(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setDados({ error: error.message || "Erro ao buscar dados" });
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!dados) return null;

    if (dados.error) {
      return (
        <div className="error-message">
          <h3>Erro:</h3>
          <p>{dados.error}</p>
        </div>
      );
    }

    if (Array.isArray(dados) && dados.length > 0) {
      return (
        <div className="query-results">
          <table className="results-table">
            <thead>
              <tr>
                {Object.keys(dados[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dados.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex}>
                      {value !== null ? value.toString() : 'NULL'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (Array.isArray(dados) && dados.length === 0) {
      return (
        <div className="success-message">
          <p>Consulta executada com sucesso, mas nenhum resultado foi retornado.</p>
        </div>
      );
    }

    return (
      <div className="json-result">
        <pre>{JSON.stringify(dados, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div>
      <div className="visualizarContainer">
        <div className="visualizarBox">
          {/* Select com todas as tabelas */}
          <div className="selectContainer">
            <h1>Escolha uma Tabela para visualizar os dados</h1>
            <select
              value={tabelaSelecionada}
              onChange={(e) => {
                const value = e.target.value;
                setTabelaSelecionada(value);
                carregarDados(value);
              }}
              disabled={loading}
            >
              <option value="">Selecione...</option>
              {tabelas.map((t, i) => {
                const nomeTabela = Object.values(t)[0];
                return <option key={i} value={nomeTabela}>{nomeTabela}</option>;
              })}
            </select>
          </div>

          {/* Exibir resultado igual à Home */}
          <div className="visualizarTabelaContainer">
            <div className="visualizarTabelaBox">
              {loading ? <p>Carregando...</p> : renderResult()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visualizar;
