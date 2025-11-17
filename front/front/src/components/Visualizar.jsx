import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

const API_URL = "http://localhost:8080/sql";

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
        <div className="error-box">
          <div className="error-icon">
            <AlertCircle className="error-icon-svg" />
          </div>
          <div>
            <h3>Erro ao carregar dados</h3>
            <p>{dados.error}</p>
          </div>
        </div>
      );
    }

    if (Array.isArray(dados) && dados.length > 0) {
      return (
        <div className="table-wrapper">
          <div className="table-info">
            <span className="table-count">{dados.length} registro(s) encontrado(s)</span>
          </div>
          <table className="data-table">
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
                      {value !== null ? value.toString() : <span className="null-value">NULL</span>}
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
        <div className="info-box">
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
    <div className="visualizar-container">
      <div className="visualizar-content">
        <div className="visualizar-header">
          <h1>Visualizar Dados das Tabelas</h1>
          <p className="visualizar-subtitle">Selecione uma tabela para visualizar seus registros</p>
        </div>

        <div className="select-card">
          <label htmlFor="table-select" className="select-label">
            Tabela
          </label>
          <select
            id="table-select"
            value={tabelaSelecionada}
            onChange={(e) => {
              const value = e.target.value;
              setTabelaSelecionada(value);
              carregarDados(value);
            }}
            disabled={loading}
            className="table-select"
          >
            <option value="">Selecione uma tabela...</option>
            {tabelas.map((t, i) => {
              const nomeTabela = typeof t === "string" ? t : Object.values(t)[0];
              return <option key={i} value={nomeTabela}>{nomeTabela}</option>;
            })}
          </select>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader className="loading-spinner" />
            <p>Carregando dados...</p>
          </div>
        ) : (
          <div className="results-card">
            {dados ? renderResult() : (
              <div className="empty-state">
                <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>Nenhuma tabela selecionada</h3>
                <p>Escolha uma tabela acima para visualizar seus dados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualizar;