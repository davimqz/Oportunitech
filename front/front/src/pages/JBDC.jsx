import React, { useEffect, useState } from 'react'

const JBDC = () => {
  
    const [tabelas, setTabelas] = useState([]);
    const [tabelaSelecionada, setTabelaSelecionada] = useState("");
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(false);


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
  
    return (
    <div>
      <div className="jbdcCabecalho">
        <div className="selectContainer">
            <h1>Escolha uma Tabela</h1>
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
      </div>
    </div>
  )
}

export default JBDC
