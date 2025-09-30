import React, { useEffect, useState } from 'react';

const JBDC = () => {
  const [tabelas, setTabelas] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://oportunitech.onrender.com/sql";
    
  const [novoEstudante, setNovoEstudante] = useState({
    primeiroNome: "",
    segundoNome: "",
    email: "",
    telefone: "",
    idade: ""
  });

  const [novoCurso, setNovoCurso] = useState({
    nome: "",
    duracao: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/tables`)
      .then(res => res.json())
      .then(data => {
        console.log("Tabelas:", data);
        setTabelas(data);
      })
      .catch(err => console.error("Erro ao buscar tabelas:", err));
  }, []);

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

  const inserirEstudante = async () => {
    try {
      const response = await fetch(`${API_URL}/estudante`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEstudante)
      });

      const result = await response.text();
      alert(result);
      carregarDados("tb_estudante");
      
      setNovoEstudante({
        primeiroNome: "",
        segundoNome: "",
        email: "",
        telefone: "",
        idade: ""
      });
    } catch (err) {
      alert("Erro ao inserir estudante: " + err.message);
    }
  };

  const inserirCurso = async () => {
    try {
      const response = await fetch(`${API_URL}/curso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCurso)
      });

      const result = await response.text();
      alert(result);
      carregarDados("tb_curso");
      
      setNovoCurso({
        nome: "",
        duracao: ""
      });
    } catch (err) {
      alert("Erro ao inserir curso: " + err.message);
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

      {/* Estudante */}
      {tabelaSelecionada === "tb_estudante" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Estudante</h2>
          <input
            type="text"
            placeholder="Primeiro Nome"
            value={novoEstudante.primeiroNome}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, primeiroNome: e.target.value })}
          />
          <input
            type="text"
            placeholder="Segundo Nome"
            value={novoEstudante.segundoNome}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, segundoNome: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={novoEstudante.email}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={novoEstudante.telefone}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, telefone: e.target.value })}
          />
          <input
            type="number"
            placeholder="Idade"
            value={novoEstudante.idade}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, idade: e.target.value })}
          />

          <div className="buttonInsert">
            <button onClick={inserirEstudante}>Salvar Estudante</button>
          </div>
        </div>
      )}

      {/* Curso */}
      {tabelaSelecionada === "tb_curso" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Curso</h2>
          <input
            type="text"
            placeholder="Nome do Curso"
            value={novoCurso.nome}
            onChange={(e) => setNovoCurso({ ...novoCurso, nome: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duração (semestres)"
            value={novoCurso.duracao}
            onChange={(e) => setNovoCurso({ ...novoCurso, duracao: e.target.value })}
          />

          <div className="buttonInsert">
            <button onClick={inserirCurso}>Salvar Curso</button>
          </div>
        </div>
      )}

      <div className="tablesSql">
        <h1>Tabela Atualizada</h1>
        {renderResult()}
      </div>
    </div>
  );
};

export default JBDC;