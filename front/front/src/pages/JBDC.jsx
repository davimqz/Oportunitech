import React, { useEffect, useState } from 'react';

const JBDC = () => {
  const [tabelas, setTabelas] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const API_URL = "http://localhost:8080/sql";

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
    codEndereco: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: ""
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
    codEmpresa: "",
    cargo: "0"
  });

  const [novoEndereco, setNovoEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    codEmpresa: ""
  });

  const [novoDepartamento, setNovoDepartamento] = useState({
    nome: "",
    codFuncionario: "",
    supervisorId: ""
  });

  // ===================== CARREGAR DADOS INICIAIS =====================
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
    carregarFuncionarios();
    carregarDepartamentos();
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

  const carregarEnderecos = async () => {
    try {
      const response = await fetch(`${API_URL}/enderecos`);
      const data = await response.json();
      setCursos(data);
    } catch (err) {
      console.error("Erro ao carregar Endereços:", err);
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

  const carregarFuncionarios = async () => {
    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: "SELECT * FROM tb_funcionario" })
      });
      const data = await response.json();
      setFuncionarios(data);
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
    }
  };

  const carregarDepartamentos = async () => {
    try {
      const response = await fetch(`${API_URL}/departamentos`);
      const data = await response.json();
      setDepartamentos(data);
    } catch (err) {
      console.error("Erro ao carregar departamentos:", err);
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

  const deletarRegistro = async (id) => {
    if (!tabelaSelecionada) return alert("Nenhuma tabela selecionada!");
    if (!id) return alert("ID inválido!");

    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      const response = await fetch(`${API_URL}/delete?table=${tabelaSelecionada}&id=${id}`, {
        method: "DELETE"
      });

      const result = await response.text();
      alert(result);

      if (response.ok) {
        carregarDados(tabelaSelecionada);
      }

    } catch (err) {
      alert("❌ Erro ao deletar: " + err.message);
    }
  };

  // ===================== INSERIR ESTUDANTE =====================
  const inserirEstudante = async () => {
    try {
      if (!novoEstudante.email || !novoEstudante.primeiroNome) {
        alert("❌ Email e Primeiro Nome são obrigatórios");
        return;
      }
      
      const dados = {
        email: novoEstudante.email,
        idade: novoEstudante.idade ? parseInt(novoEstudante.idade) : null,
        primeiroNome: novoEstudante.primeiroNome,
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

  // ===================== INSERIR CURSO =====================
  const inserirCurso = async () => {
    try {
      if (!novoCurso.nome) {
        alert("❌ Nome do curso é obrigatório");
        return;
      }
      
      const dados = {
        nome: novoCurso.nome,
        duracao: novoCurso.duracao ? parseInt(novoCurso.duracao) : null,
        type: novoCurso.type ? parseInt(novoCurso.type) : 0
      };
      
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

  // ===================== INSERIR EMPRESA =====================
  const inserirEmpresa = async () => {
    try {
      if (!novaEmpresa.nome) {
        alert("❌ Nome da empresa é obrigatório");
        return;
      }
      
      // Primeiro, criar o endereço se fornecido
      let codEndereco = null;
      
      if (novaEmpresa.rua && novaEmpresa.cidade && novaEmpresa.estado) {
        const dadosEndereco = {
          rua: novaEmpresa.rua,
          numero: novaEmpresa.numero || null,
          bairro: novaEmpresa.bairro || null,
          cidade: novaEmpresa.cidade,
          estado: novaEmpresa.estado,
          codEmpresa: null // Será atualizado depois
        };

        const responseEndereco = await fetch(`${API_URL}/endereco`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosEndereco)
        });

        if (!responseEndereco.ok) {
          const error = await responseEndereco.text();
          alert("❌ Erro ao criar endereço: " + error);
          return;
        }

        const resultEndereco = await responseEndereco.text();
        // Extrair cod_endereco da resposta (assumindo que retorna algo como "Endereço inserido com sucesso! Linhas afetadas: 1")
        // Vamos fazer uma consulta para pegar o último endereço inserido
        const enderecosResponse = await fetch(`${API_URL}/enderecos`);
        const enderecos = await enderecosResponse.json();
        codEndereco = enderecos[enderecos.length - 1].cod_endereco;
      }
      
      // Criar a empresa com o cod_endereco
      const dadosEmpresa = {
        nome: novaEmpresa.nome,
        razaoSocial: novaEmpresa.razaoSocial || null,
        codEndereco: codEndereco
      };
      
      const responseEmpresa = await fetch(`${API_URL}/empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEmpresa)
      });

      if (!responseEmpresa.ok) {
        const error = await responseEmpresa.text();
        alert("❌ Erro ao criar empresa: " + error);
        return;
      }

      const empresaCriada = await responseEmpresa.json();
      
      // Se criou endereço, atualizar o cod_empresa no endereço
      if (codEndereco) {
        await fetch(`${API_URL}/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            sql: `UPDATE endereco SET cod_empresa = ${empresaCriada.cod_empresa} WHERE cod_endereco = ${codEndereco}` 
          })
        });
      }

      alert("✅ Empresa criada com sucesso!");
      
      carregarDados("tb_empresa");
      carregarEmpresas();
      setNovaEmpresa({
        nome: "",
        razaoSocial: "",
        codEndereco: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: ""
      });
    } catch (err) {
      alert("❌ Erro ao inserir empresa: " + err.message);
    }
  };

  // ===================== INSERIR VAGA =====================
  const inserirVaga = async () => {
    try {
      if (!novaVaga.titulo) {
        alert("❌ Título é obrigatório");
        return;
      }
      if (!novaVaga.codEmpresa) {
        alert("❌ Selecione uma empresa");
        return;
      }
      
      const empresaSelecionada = empresas.find(
        emp => emp.cod_empresa.toString() === novaVaga.codEmpresa.toString()
      );
      
      if (!empresaSelecionada) {
        alert("❌ Empresa não encontrada");
        return;
      }
      
      const dados = {
        titulo: novaVaga.titulo,
        descricao: novaVaga.descricao || null,
        cargaHoraria: novaVaga.cargaHoraria ? parseInt(novaVaga.cargaHoraria) : null,
        modalidades: novaVaga.modalidades ? parseInt(novaVaga.modalidades) : 0,
        salario: novaVaga.salario || null,
        codEmpresa: parseInt(novaVaga.codEmpresa),
        nomeEmpresa: empresaSelecionada.nome,
        logoLink: novaVaga.logoLink || null
      };
      
      const response = await fetch(`${API_URL}/vaga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const result = await response.text();
      alert(result);
      
      if (response.ok) {
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
      }
    } catch (err) {
      alert("❌ Erro ao inserir vaga: " + err.message);
    }
  };

  // ===================== INSERIR FUNCIONÁRIO =====================
  const inserirFuncionario = async () => {
    try {
      if (!novoFuncionario.primeiroNome) {
        alert("❌ Primeiro nome é obrigatório");
        return;
      }
      if (!novoFuncionario.email) {
        alert("❌ Email é obrigatório");
        return;
      }
      if (!novoFuncionario.codEmpresa) {
        alert("❌ Selecione uma empresa");
        return;
      }
      
      const dados = {
        primeiroNome: novoFuncionario.primeiroNome,
        segundoNome: novoFuncionario.segundoNome || null,
        email: novoFuncionario.email,
        codEmpresa: parseInt(novoFuncionario.codEmpresa)
      };
      
      const response = await fetch(`${API_URL}/funcionario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const result = await response.text();
      alert(result);
      
      if (response.ok) {
        carregarDados("tb_funcionario");
        carregarFuncionarios();
        setNovoFuncionario({
          primeiroNome: "",
          segundoNome: "",
          email: "",
          codEmpresa: ""
        });
      }
    } catch (err) {
      alert("❌ Erro ao inserir funcionário: " + err.message);
    }
  };

  const inserirEndereco = async () => {
    try {
      if (!novoEndereco.rua) {
        alert("❌ Rua é obrigatória");
        return;
      }
      if (!novoEndereco.cidade) {
        alert("❌ Cidade é obrigatória");
        return;
      }
      if (!novoEndereco.estado) {
        alert("❌ Estado é obrigatório");
        return;
      }
      
      const dados = {
        rua: novoEndereco.rua,
        numero: novoEndereco.numero || null,
        bairro: novoEndereco.bairro || null,
        cidade: novoEndereco.cidade,
        estado: novoEndereco.estado,
        codEmpresa: novoEndereco.codEmpresa ? parseInt(novoEndereco.codEmpresa) : null
      };
      
      const response = await fetch(`${API_URL}/endereco`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const result = await response.text();
      alert(result);
      
      if (response.ok) {
        carregarDados("endereco");
        carregarEnderecos();
        setNovoEndereco({
          rua: "",
          numero: "",
          bairro: "",
          cidade: "",
          estado: "",
          codEmpresa: ""
        });
      }
    } catch (err) {
      alert("❌ Erro ao inserir endereço: " + err.message);
    }
  };

  // ===================== INSERIR DEPARTAMENTO =====================
  const inserirDepartamento = async () => {
    try {
      if (!novoDepartamento.nome) {
        alert("❌ Nome do departamento é obrigatório");
        return;
      }
      
      const dados = {
        nome: novoDepartamento.nome,
        codFuncionario: novoDepartamento.codFuncionario ? parseInt(novoDepartamento.codFuncionario) : null,
        supervisorId: novoDepartamento.supervisorId ? parseInt(novoDepartamento.supervisorId) : null
      };
      
      const response = await fetch(`${API_URL}/departamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const result = await response.text();
      alert(result);
      
      if (response.ok) {
        carregarDados("tb_departamento");
        carregarDepartamentos();
        setNovoDepartamento({
          nome: "",
          codFuncionario: "",
          supervisorId: ""
        });
      }
    } catch (err) {
      alert("❌ Erro ao inserir departamento: " + err.message);
    }
  };

  // ===================== RENDER RESULT =====================
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
                <th>Ações</th>
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
                  <td onClick={() => deletarRegistro(row[Object.keys(row)[0]])}>
                    <i className="fa-solid fa-trash" style={{ cursor: "pointer", color: "red" }}></i>
                  </td>
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

      {/* ===================== ESTUDANTE ===================== */}
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

      {/* ===================== CURSO ===================== */}
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

      {/* ===================== EMPRESA ===================== */}
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

      {/* ===================== VAGA ===================== */}
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

      {/* ===================== FUNCIONÁRIO ===================== */}
      {tabelaSelecionada === "tb_funcionario" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Funcionário</h2>
          <input type="text" placeholder="Primeiro Nome" value={novoFuncionario.primeiroNome}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, primeiroNome: e.target.value })} />
          <input type="text" placeholder="Segundo Nome" value={novoFuncionario.segundoNome}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, segundoNome: e.target.value })} />
          <input type="email" placeholder="Email" value={novoFuncionario.email}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })} />
          <select value={novoFuncionario.cargo}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })}>
            <option value="0">Gerente</option>
            <option value="1">Comum</option>
          </select>
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
      {/* ===================== ENDEREÇO ===================== */}
      {tabelaSelecionada === "endereco" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Endereço</h2>
          <input type="text" placeholder="Rua *" value={novoEndereco.rua}
            onChange={(e) => setNovoEndereco({ ...novoEndereco, rua: e.target.value })} />
          <input type="text" placeholder="Número" value={novoEndereco.numero}
            onChange={(e) => setNovoEndereco({ ...novoEndereco, numero: e.target.value })} />
          <input type="text" placeholder="Bairro" value={novoEndereco.bairro}
            onChange={(e) => setNovoEndereco({ ...novoEndereco, bairro: e.target.value })} />
          <input type="text" placeholder="Cidade *" value={novoEndereco.cidade}
            onChange={(e) => setNovoEndereco({ ...novoEndereco, cidade: e.target.value })} />
          <input type="text" placeholder="Estado (UF) *" maxLength="2" value={novoEndereco.estado}
            onChange={(e) => setNovoEndereco({ ...novoEndereco, estado: e.target.value.toUpperCase() })} />
          <select value={novoEndereco.codEmpresa}
            onChange={(e) => setNovoEndereco({ ...novoEndereco, codEmpresa: e.target.value })}>
            <option value="">Selecione uma Empresa (Opcional)</option>
            {empresas.map((empresa) => (
              <option key={empresa.cod_empresa} value={empresa.cod_empresa}>
                {empresa.nome}
              </option>
            ))}
          </select>
          <div className="buttonInsert">
            <button onClick={inserirEndereco}>Salvar Endereço</button>
          </div>
        </div>
      )}

      {/* ===================== DEPARTAMENTO ===================== */}
      {tabelaSelecionada === "tb_departamento" && (
        <div className='tabelasInsert'>
          <h2>Inserir Novo Departamento</h2>
          <input 
            type="text" 
            placeholder="Nome do Departamento *" 
            value={novoDepartamento.nome}
            onChange={(e) => setNovoDepartamento({ ...novoDepartamento, nome: e.target.value })} 
          />
          
         <select 
          value={novoDepartamento.codFuncionario}
          onChange={(e) => setNovoDepartamento({ ...novoDepartamento, codFuncionario: e.target.value })}>
          <option value="">Selecione um Funcionário Responsável (Opcional)</option>
          {funcionarios.map((func) => (
            func.cargo === 1 && (
              <option key={func.cod_funcionario} value={func.cod_funcionario}>
                {func.primeiro_nome} {func.segundo_nome} - {func.email}
              </option>
            )
          ))}
        </select>
          
          <select 
            value={novoDepartamento.supervisorId}
            onChange={(e) => setNovoDepartamento({ ...novoDepartamento, supervisorId: e.target.value })}>
            <option value="">Selecione um Departamento Supervisor (Opcional)</option>
            {departamentos.map((dept) => (
              <option key={dept.cod_dep} value={dept.cod_dep}>
                {dept.nome}
              </option>
            ))}
          </select>
          
          <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
            💡 O departamento supervisor cria uma hierarquia entre departamentos
          </p>
          
          <div className="buttonInsert">
            <button onClick={inserirDepartamento}>Salvar Departamento</button>
          </div>
        </div>
      )}

      {/* ===================== TABELA ATUALIZADA ===================== */}
      <div className="tablesSql">
        <h1>Tabela Atualizada</h1>
        {renderResult()}
      </div>
    </div>
  );
};

export default JBDC;