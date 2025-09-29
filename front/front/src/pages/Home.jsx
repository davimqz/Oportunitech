import React, { useState } from 'react'

const Home = () => {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSql() {
    if (!sql.trim()) {
      setResult({ error: "Digite um comando SQL" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://oportunitech.onrender.com/sql/execute", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ sql: sql.trim() }) 
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

      setResult(data);
    } catch (error) {
      console.error("Erro ao executar SQL:", error);
      setResult({ error: error.message || "Erro ao executar a consulta" });
    } finally {
      setLoading(false);
    }
  }


  const renderResult = () => {
    if (!result) return null;

    if (result.error) {
      return (
        <div className="error-message">
          <h3>Erro:</h3>
          <p>{result.error}</p>
        </div>
      );
    } else {
      <div className="success-message">
        <p>Codigo Funcionando</p>
      </div>
    }

    if (Array.isArray(result) && result.length > 0) {
      return (
        <div className="query-results">
          <table className="results-table">
            <thead>
              <tr>
                {Object.keys(result[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((row, index) => (
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

    if (Array.isArray(result) && result.length === 0) {
      return (
        <div className="success-message">
          <p>Consulta executada com sucesso, mas nenhum resultado foi retornado.</p>
        </div>
      );
    }

    return (
      <div className="json-result">
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div>
      <div className="cabecalhoSql">
        <h1>Executar Codigos SQL</h1>
      </div>

      <div className="sqlContainer">
        <div className="sqlbox">
          <div className="sqlInput">
            <div className="cabecalhoInput">
              <i className="fa-solid fa-database"></i>
              <p>Digite um Código SQL</p>
            </div>
            <textarea 
              onChange={(e) => setSql(e.target.value)} 
              rows="5" 
              cols="50" 
              placeholder="Escreva seu SQL aqui..."
              value={sql}
            />
          </div>
          <div className="sqlButton">
            <button onClick={handleSql} disabled={loading}>
              {loading ? "Executando..." : "Realizar Consulta"}
            </button>
          </div>
        </div>
      </div>

      <div className="tablesSql">
        <h1>Resultado da Consulta</h1>
        {renderResult()}
      </div>
    </div>
  )
}

export default Home
