import React, { useEffect, useState } from 'react';

const JBDC = () => {
  const [tabelas, setTabelas] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const API_URL = "https://oportunitech-1.onrender.com/sql";

  const [novoEstudante, setNovoEstudante] = useState({
    primeiroNome: "",
    segundoNome: "",
    email: "",
    telefone: "",
    idade: "",
    codCurso: ""
  });

  const [novoCurso, setNovoCurso] = useState({
    nome: "",
    duracao: "",
    type: "0"
  });

  const [novaEmpresa, setNovaEmpresa] = useState({
    nome: "",
    razaoSocial: "",
    codEndereco: ""
  });

  const [novaVaga, setNovaVaga] = useState({
    titulo: "",
    descricao: "",
    cargaHoraria: "",
    modalidades: "0",
    salario: "",
    codEmpresa: "",
    logoLink: ""
  });

  const [novoFuncionario, setNovoFuncionario] = useState({
    primeiroNome: "",
    segundoNome: "",
    email: "",
    codEmpresa: ""
  });

  // Inserir Funcionário
  const inserirFuncionario = async () => {
    try {
      const response = await fetch(`${API_URL}/funcionario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoFuncionario)
      });

      const result = await response.text();
      alert(result);
      carregarDados("tb_funcionario");

      setNovoFuncionario({
        primeiroNome: "",
        segundoNome: "",
        email: "",
        codEmpresa: ""
      });
    } catch (err) {
      alert("Erro ao inserir funcionário: " + err.message);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/tables`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Erro HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Tabelas recebidas:", data);
        setTabelas(data);
      })
      .catch(err => console.error("Erro ao buscar tabelas:", err));

    carregarCursos();
    carregarEmpresas();
  }, []);

  const carregarCursos = async () => {
    try {
      const response = await fetch(`${API_URL}/cursos`);
      const data = await response.json();
      setCursos(data);
    } catch (err) {
      console.error("Erro ao carregar cursos:", err);
    }
  };

  const carregarEmpresas = async () => {
    try {
      const response = await fetch(`${API_URL}/empresas`);
      const data = await response.json();
      setEmpresas(data);
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
    }
  };

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
    // Validação no frontend
    if (!novoEstudante.email || !novoEstudante.primeiroNome) {
      alert("❌ Email e Primeiro Nome são obrigatórios");
      return;
    }
    
    // Preparar dados - converter strings vazias em null
    const dados = {
      email: novoEstudante.email || null,
      idade: novoEstudante.idade ? parseInt(novoEstudante.idade) : null,
      primeiroNome: novoEstudante.primeiroNome || null,
      segundoNome: novoEstudante.segundoNome || null,
      telefone: novoEstudante.telefone || null,
      codCurso: novoEstudante.codCurso ? parseInt(novoEstudante.codCurso) : null
    };
    
    const response = await fetch(`${API_URL}/estudante`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const result = await response.text();
    alert(result);
    
    if (response.ok) {
      carregarDados("tb_estudante");
      
      // Limpar formulário
      setNovoEstudante({
        primeiroNome: "",
        segundoNome: "",
        email: "",
        telefone: "",
        idade: "",
        codCurso: ""
      });
    }
  } catch (err) {
    alert("❌ Erro ao inserir estudante: " + err.message);
  }
};

  const inserirCurso = async () => {
    try {
      // Validação no frontend
      if (!novoCurso.nome) {
        alert("❌ Nome do curso é obrigatório");
        return;
      }
      
      // Preparar dados
      const dados = {
        nome: novoCurso.nome,
        duracao: novoCurso.duracao ? parseInt(novoCurso.duracao) : null,
        type: novoCurso.type ? parseInt(novoCurso.type) : 0
      };
      
      console.log("Enviando curso:", dados); // Debug
      
      const response = await fetch(`${API_URL}/curso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const result = await response.text();
      alert(result);
      
      if (response.ok) {
        carregarDados("tb_curso");
        carregarCursos();
        
        // Limpar formulário
        setNovoCurso({
          nome: "",
          duracao: "",
          type: "0"
        });
      }
    } catch (err) {
      alert("❌ Erro ao inserir curso: " + err.message);
    }
  };

  const inserirEmpresa = async () => {
    try {
      const response = await fetch(`${API_URL}/empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaEmpresa)
      });

      const result = await response.text();
      alert(result);
      carregarDados("tb_empresa");
      carregarEmpresas();

      setNovaEmpresa({
        nome: "",
        razaoSocial: "",
        codEndereco: ""
      });
    } catch (err) {
      alert("Erro ao inserir empresa: " + err.message);
    }
  };

  const inserirVaga = async () => {
    try {
      const response = await fetch(`${API_URL}/vaga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaVaga)
      });

      const result = await response.text();
      alert(result);
      carregarDados("tb_vaga");

      setNovaVaga({
        titulo: "",
        descricao: "",
        cargaHoraria: "",
        modalidades: "0",
        salario: "",
        codEmpresa: "",
        logoLink: ""
      });
    } catch (err) {
      alert("Erro ao inserir vaga: " + err.message);
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
              let nomeTabela;
              if (typeof t === 'string') {
                nomeTabela = t;
              } else if (typeof t === 'object' && t !== null) {
                nomeTabela = t.TABLE_NAME || t.table_name || t.name || Object.values(t)[0];
              }
              return <option key={i} value={nomeTabela}>{nomeTabela}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Estudante */}
      {tabelaSelecionada === "tb_estudante" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Estudante</h2>
          <input type="email" placeholder="Email" value={novoEstudante.email}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, email: e.target.value })} />
          <input type="number" placeholder="Idade" value={novoEstudante.idade}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, idade: e.target.value })} />
          <input type="text" placeholder="Primeiro Nome" value={novoEstudante.primeiroNome}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, primeiroNome: e.target.value })} />
          <input type="text" placeholder="Segundo Nome" value={novoEstudante.segundoNome}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, segundoNome: e.target.value })} />
          <input type="text" placeholder="Telefone" value={novoEstudante.telefone}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, telefone: e.target.value })} />
          <select value={novoEstudante.codCurso}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, codCurso: e.target.value })}>
            <option value="">Selecione um Curso</option>
            {cursos.map((curso) => (
              <option key={curso.cod_curso} value={curso.cod_curso}>
                {curso.nome}
              </option>
            ))}
          </select>
          <div className="buttonInsert">
            <button onClick={inserirEstudante}>Salvar Estudante</button>
          </div>
        </div>
      )}

      {/* Curso */}
      {tabelaSelecionada === "tb_curso" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Curso</h2>
          <input type="number" placeholder="Duração (Horas)" value={novoCurso.duracao}
            onChange={(e) => setNovoCurso({ ...novoCurso, duracao: e.target.value })} />
          <input type="text" placeholder="Nome do Curso" value={novoCurso.nome}
            onChange={(e) => setNovoCurso({ ...novoCurso, nome: e.target.value })} />
          <select value={novoCurso.type}
            onChange={(e) => setNovoCurso({ ...novoCurso, type: e.target.value })}>
            <option value="0">Graduação</option>
            <option value="1">Pós-Graduação</option>
            <option value="2">Técnico</option>
          </select>
          <div className="buttonInsert">
            <button onClick={inserirCurso}>Salvar Curso</button>
          </div>
        </div>
      )}

      {/* Empresa */}
      {tabelaSelecionada === "tb_empresa" && (
        <div className='tabelasInsert'>
          <h2>Inserir Nova Empresa</h2>
          <input type="text" placeholder="Nome" value={novaEmpresa.nome}
            onChange={(e) => setNovaEmpresa({ ...novaEmpresa, nome: e.target.value })} />
          <input type="text" placeholder="Razão Social" value={novaEmpresa.razaoSocial}
            onChange={(e) => setNovaEmpresa({ ...novaEmpresa, razaoSocial: e.target.value })} />
          <input type="number" placeholder="Código do Endereço" value={novaEmpresa.codEndereco}
            onChange={(e) => setNovaEmpresa({ ...novaEmpresa, codEndereco: e.target.value })} />
          <div className="buttonInsert">
            <button onClick={inserirEmpresa}>Salvar Empresa</button>
          </div>
        </div>
      )}

      {/* Vaga */}
      {tabelaSelecionada === "tb_vaga" && (
        <div className='tabelasInsert'>
          <h2>Inserir Nova Vaga</h2>
          <input type="text" placeholder="Título" value={novaVaga.titulo}
            onChange={(e) => setNovaVaga({ ...novaVaga, titulo: e.target.value })} />
          <textarea placeholder="Descrição" value={novaVaga.descricao}
            onChange={(e) => setNovaVaga({ ...novaVaga, descricao: e.target.value })} rows="3" />
          <input type="number" placeholder="Carga Horária" value={novaVaga.cargaHoraria}
            onChange={(e) => setNovaVaga({ ...novaVaga, cargaHoraria: e.target.value })} />
          <select value={novaVaga.modalidades}
            onChange={(e) => setNovaVaga({ ...novaVaga, modalidades: e.target.value })}>
            <option value="0">Presencial</option>
            <option value="1">Remoto</option>
            <option value="2">Híbrido</option>
          </select>
          <input type="number" step="0.01" placeholder="Salário" value={novaVaga.salario}
            onChange={(e) => setNovaVaga({ ...novaVaga, salario: e.target.value })} />
          <select value={novaVaga.codEmpresa}
            onChange={(e) => setNovaVaga({ ...novaVaga, codEmpresa: e.target.value })}>
            <option value="">Selecione uma Empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.cod_empresa} value={empresa.cod_empresa}>
                {empresa.nome}
              </option>
            ))}
          </select>
          <input type="text" placeholder="Link do Logo (URL)" value={novaVaga.logoLink}
            onChange={(e) => setNovaVaga({ ...novaVaga, logoLink: e.target.value })} />
          <div className="buttonInsert">
            <button onClick={inserirVaga}>Salvar Vaga</button>
          </div>
        </div>
      )}

      {/* Funcionário */}
      {tabelaSelecionada === "tb_funcionario" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Funcionário</h2>
          <input type="text" placeholder="Primeiro Nome" value={novoFuncionario.primeiroNome}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, primeiroNome: e.target.value })} />
          <input type="text" placeholder="Segundo Nome" value={novoFuncionario.segundoNome}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, segundoNome: e.target.value })} />
          <input type="email" placeholder="Email" value={novoFuncionario.email}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })} />
          <select value={novoFuncionario.codEmpresa}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, codEmpresa: e.target.value })}>
            <option value="">Selecione uma Empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.cod_empresa} value={empresa.cod_empresa}>
                {empresa.nome}
              </option>
            ))}
          </select>
          <div className="buttonInsert">
            <button onClick={inserirFuncionario}>Salvar Funcionário</button>
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
