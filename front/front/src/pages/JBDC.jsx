import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

// Componente de Notificação Toast
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="toast-icon" />,
    error: <XCircle className="toast-icon" />,
    warning: <AlertCircle className="toast-icon" />
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type]}
      <p className="toast-message">{message}</p>
      <button onClick={onClose} className="toast-close">
        <X className="toast-close-icon" />
      </button>
    </div>
  );
};

// Container de Toasts
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Modal de Confirmação
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <div className="confirm-icon">
            <AlertCircle className="confirm-icon-svg" />
          </div>
          <div className="confirm-content">
            <h3 className="confirm-title">Confirmar Ação</h3>
            <p className="confirm-message">{message}</p>
          </div>
        </div>
        <div className="confirm-actions">
          <button onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

const JBDC = () => {
  const [tabelas, setTabelas] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

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

  // Sistema de Notificações
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showConfirm = (message) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  };

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
      .catch(err => {
        console.error("Erro ao buscar tabelas:", err);
        showToast("Erro ao carregar tabelas", "error");
      });

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
      showToast("Erro ao carregar cursos", "error");
    }
  };

  const carregarEnderecos = async () => {
    try {
      const response = await fetch(`${API_URL}/enderecos`);
      const data = await response.json();
      setCursos(data);
    } catch (err) {
      console.error("Erro ao carregar Endereços:", err);
      showToast("Erro ao carregar endereços", "error");
    }
  };

  const carregarEmpresas = async () => {
    try {
      const response = await fetch(`${API_URL}/empresas`);
      const data = await response.json();
      setEmpresas(data);
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
      showToast("Erro ao carregar empresas", "error");
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
      showToast("Erro ao carregar funcionários", "error");
    }
  };

  const carregarDepartamentos = async () => {
    try {
      const response = await fetch(`${API_URL}/departamentos`);
      const data = await response.json();
      setDepartamentos(data);
    } catch (err) {
      console.error("Erro ao carregar departamentos:", err);
      showToast("Erro ao carregar departamentos", "error");
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
      showToast("Erro ao buscar dados da tabela", "error");
    } finally {
      setLoading(false);
    }
  };

  const deletarRegistro = async (id) => {
    if (!tabelaSelecionada) {
      showToast("Nenhuma tabela selecionada!", "warning");
      return;
    }
    if (!id) {
      showToast("ID inválido!", "warning");
      return;
    }

    const confirmed = await showConfirm("Tem certeza que deseja excluir este registro?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/delete?table=${tabelaSelecionada}&id=${id}`, {
        method: "DELETE"
      });

      const result = await response.text();

      if (response.ok) {
        showToast("Registro excluído com sucesso!", "success");
        carregarDados(tabelaSelecionada);
      } else {
        showToast(result, "error");
      }
    } catch (err) {
      showToast("Erro ao deletar: " + err.message, "error");
    }
  };

  // ===================== INSERIR ESTUDANTE =====================
  const inserirEstudante = async () => {
    try {
      if (!novoEstudante.email || !novoEstudante.primeiroNome) {
        showToast("Email e Primeiro Nome são obrigatórios", "warning");
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
      
      if (response.ok) {
        showToast("Estudante inserido com sucesso!", "success");
        carregarDados("tb_estudante");
        setNovoEstudante({
          primeiroNome: "",
          segundoNome: "",
          email: "",
          telefone: "",
          idade: "",
          codCurso: ""
        });
      } else {
        showToast(result, "error");
      }
    } catch (err) {
      showToast("Erro ao inserir estudante: " + err.message, "error");
    }
  };

  // ===================== INSERIR CURSO =====================
  const inserirCurso = async () => {
    try {
      if (!novoCurso.nome) {
        showToast("Nome do curso é obrigatório", "warning");
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
      
      if (response.ok) {
        showToast("Curso inserido com sucesso!", "success");
        carregarDados("tb_curso");
        carregarCursos();
        setNovoCurso({
          nome: "",
          duracao: "",
          type: "0"
        });
      } else {
        showToast(result, "error");
      }
    } catch (err) {
      showToast("Erro ao inserir curso: " + err.message, "error");
    }
  };

  // ===================== INSERIR EMPRESA =====================
  const inserirEmpresa = async () => {
    try {
      if (!novaEmpresa.nome) {
        showToast("Nome da empresa é obrigatório", "warning");
        return;
      }
      
      let codEndereco = null;
      
      if (novaEmpresa.rua && novaEmpresa.cidade && novaEmpresa.estado) {
        const dadosEndereco = {
          rua: novaEmpresa.rua,
          numero: novaEmpresa.numero || null,
          bairro: novaEmpresa.bairro || null,
          cidade: novaEmpresa.cidade,
          estado: novaEmpresa.estado,
          codEmpresa: null
        };

        const responseEndereco = await fetch(`${API_URL}/endereco`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosEndereco)
        });

        if (!responseEndereco.ok) {
          const error = await responseEndereco.text();
          showToast("Erro ao criar endereço: " + error, "error");
          return;
        }

        const enderecosResponse = await fetch(`${API_URL}/enderecos`);
        const enderecos = await enderecosResponse.json();
        codEndereco = enderecos[enderecos.length - 1].cod_endereco;
      }
      
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
        showToast("Erro ao criar empresa: " + error, "error");
        return;
      }

      const empresaCriada = await responseEmpresa.json();
      
      if (codEndereco) {
        await fetch(`${API_URL}/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            sql: `UPDATE endereco SET cod_empresa = ${empresaCriada.cod_empresa} WHERE cod_endereco = ${codEndereco}` 
          })
        });
      }

      showToast("Empresa criada com sucesso!", "success");
      
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
      showToast("Erro ao inserir empresa: " + err.message, "error");
    }
  };

  // ===================== INSERIR VAGA =====================
  const inserirVaga = async () => {
    try {
      if (!novaVaga.titulo) {
        showToast("Título é obrigatório", "warning");
        return;
      }
      if (!novaVaga.codEmpresa) {
        showToast("Selecione uma empresa", "warning");
        return;
      }
      
      const empresaSelecionada = empresas.find(
        emp => emp.cod_empresa.toString() === novaVaga.codEmpresa.toString()
      );
      
      if (!empresaSelecionada) {
        showToast("Empresa não encontrada", "error");
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
      
      if (response.ok) {
        showToast("Vaga inserida com sucesso!", "success");
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
      } else {
        showToast(result, "error");
      }
    } catch (err) {
      showToast("Erro ao inserir vaga: " + err.message, "error");
    }
  };

  // ===================== INSERIR FUNCIONÁRIO =====================
  const inserirFuncionario = async () => {
    try {
      if (!novoFuncionario.primeiroNome) {
        showToast("Primeiro nome é obrigatório", "warning");
        return;
      }
      if (!novoFuncionario.email) {
        showToast("Email é obrigatório", "warning");
        return;
      }
      if (!novoFuncionario.codEmpresa) {
        showToast("Selecione uma empresa", "warning");
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
      
      if (response.ok) {
        showToast("Funcionário inserido com sucesso!", "success");
        carregarDados("tb_funcionario");
        carregarFuncionarios();
        setNovoFuncionario({
          primeiroNome: "",
          segundoNome: "",
          email: "",
          codEmpresa: ""
        });
      } else {
        showToast(result, "error");
      }
    } catch (err) {
      showToast("Erro ao inserir funcionário: " + err.message, "error");
    }
  };

  const inserirEndereco = async () => {
    try {
      if (!novoEndereco.rua) {
        showToast("Rua é obrigatória", "warning");
        return;
      }
      if (!novoEndereco.cidade) {
        showToast("Cidade é obrigatória", "warning");
        return;
      }
      if (!novoEndereco.estado) {
        showToast("Estado é obrigatório", "warning");
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
      
      if (response.ok) {
        showToast("Endereço inserido com sucesso!", "success");
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
      } else {
        showToast(result, "error");
      }
    } catch (err) {
      showToast("Erro ao inserir endereço: " + err.message, "error");
    }
  };

  // ===================== INSERIR DEPARTAMENTO =====================
  const inserirDepartamento = async () => {
    try {
      if (!novoDepartamento.nome) {
        showToast("Nome do departamento é obrigatório", "warning");
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
      
      if (response.ok) {
        showToast("Departamento inserido com sucesso!", "success");
        carregarDados("tb_departamento");
        carregarDepartamentos();
        setNovoDepartamento({
          nome: "",
          codFuncionario: "",
          supervisorId: ""
        });
      } else {
        showToast(result, "error");
      }
    } catch (err) {
      showToast("Erro ao inserir departamento: " + err.message, "error");
    }
  };

  // ===================== RENDER RESULT =====================
  const renderResult = () => {
    if (!dados) return null;

    if (dados.error) {
      return (
        <div className="error-box">
          <h3>Erro:</h3>
          <p>{dados.error}</p>
        </div>
      );
    }

    if (Array.isArray(dados) && dados.length > 0) {
      return (
        <div className="table-wrapper">
          <table className="data-table">
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
                      {value !== null ? value.toString() : <span className="null-value">NULL</span>}
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => deletarRegistro(row[Object.keys(row)[0]])}
                      className="btn-delete"
                    >
                      <XCircle className="icon-delete" />
                    </button>
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
        <div className="info-box">
          <p>Consulta executada com sucesso, mas nenhum resultado foi retornado.</p>
        </div>
      );
    }
  };

  return (
    <div className="jbdc-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}

      <div className="jbdc-content">
        <div className="jbdc-header">
          <h1>Escolha uma Tabela</h1>
          <select
            value={tabelaSelecionada}
            onChange={(e) => {
              const value = e.target.value;
              setTabelaSelecionada(value);
              carregarDados(value);
            }}
            disabled={loading}
            className="table-select"
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

        {/* ===================== ESTUDANTE ===================== */}
        {tabelaSelecionada === "tb_estudante" && (
          <div className="form-card">
            <h2>Inserir Novo Estudante</h2>
            <div className="form-grid">
              <input
                type="email"
                placeholder="Email"
                value={novoEstudante.email}
                onChange={(e) => setNovoEstudante({ ...novoEstudante, email: e.target.value })}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Idade"
                value={novoEstudante.idade}
                onChange={(e) => setNovoEstudante({ ...novoEstudante, idade: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Primeiro Nome"
                value={novoEstudante.primeiroNome}
                onChange={(e) => setNovoEstudante({ ...novoEstudante, primeiroNome: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Segundo Nome"
                value={novoEstudante.segundoNome}
                onChange={(e) => setNovoEstudante({ ...novoEstudante, segundoNome: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Telefone"
                value={novoEstudante.telefone}
                onChange={(e) => setNovoEstudante({ ...novoEstudante, telefone: e.target.value })}
                className="form-input"
              />
              <select
                value={novoEstudante.codCurso}
                onChange={(e) => setNovoEstudante({ ...novoEstudante, codCurso: e.target.value })}
                className="form-input"
              >
                <option value="">Selecione um Curso</option>
                {cursos.map((curso) => (
                  <option key={curso.cod_curso} value={curso.cod_curso}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={inserirEstudante} className="btn-primary">
              Salvar Estudante
            </button>
          </div>
        )}

        {/* ===================== CURSO ===================== */}
        {tabelaSelecionada === "tb_curso" && (
          <div className="form-card">
            <h2>Inserir Novo Curso</h2>
            <div className="form-grid">
              <input
                type="number"
                placeholder="Duração (Horas)"
                value={novoCurso.duracao}
                onChange={(e) => setNovoCurso({ ...novoCurso, duracao: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Nome do Curso"
                value={novoCurso.nome}
                onChange={(e) => setNovoCurso({ ...novoCurso, nome: e.target.value })}
                className="form-input"
              />
              <select
                value={novoCurso.type}
                onChange={(e) => setNovoCurso({ ...novoCurso, type: e.target.value })}
                className="form-input"
              >
                <option value="0">Graduação</option>
                <option value="1">Pós-Graduação</option>
                <option value="2">Técnico</option>
              </select>
            </div>
            <button onClick={inserirCurso} className="btn-primary">
              Salvar Curso
            </button>
          </div>
        )}

        {/* ===================== EMPRESA ===================== */}
        {tabelaSelecionada === "tb_empresa" && (
          <div className="form-card">
            <h2>Inserir Nova Empresa</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Nome"
                value={novaEmpresa.nome}
                onChange={(e) => setNovaEmpresa({ ...novaEmpresa, nome: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Razão Social"
                value={novaEmpresa.razaoSocial}
                onChange={(e) => setNovaEmpresa({ ...novaEmpresa, razaoSocial: e.target.value })}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Código do Endereço"
                value={novaEmpresa.codEndereco}
                onChange={(e) => setNovaEmpresa({ ...novaEmpresa, codEndereco: e.target.value })}
                className="form-input"
              />
            </div>
            <button onClick={inserirEmpresa} className="btn-primary">
              Salvar Empresa
            </button>
          </div>
        )}

        {/* ===================== VAGA ===================== */}
        {tabelaSelecionada === "tb_vaga" && (
          <div className="form-card">
            <h2>Inserir Nova Vaga</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Título"
                value={novaVaga.titulo}
                onChange={(e) => setNovaVaga({ ...novaVaga, titulo: e.target.value })}
                className="form-input"
              />
              <textarea
                placeholder="Descrição"
                value={novaVaga.descricao}
                onChange={(e) => setNovaVaga({ ...novaVaga, descricao: e.target.value })}
                rows="3"
                className="form-input"
              />
              <input
                type="number"
                placeholder="Carga Horária"
                value={novaVaga.cargaHoraria}
                onChange={(e) => setNovaVaga({ ...novaVaga, cargaHoraria: e.target.value })}
                className="form-input"
              />
              <select
                value={novaVaga.modalidades}
                onChange={(e) => setNovaVaga({ ...novaVaga, modalidades: e.target.value })}
                className="form-input"
              >
                <option value="0">Presencial</option>
                <option value="1">Remoto</option>
                <option value="2">Híbrido</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Salário"
                value={novaVaga.salario}
                onChange={(e) => setNovaVaga({ ...novaVaga, salario: e.target.value })}
                className="form-input"
              />
              <select
                value={novaVaga.codEmpresa}
                onChange={(e) => setNovaVaga({ ...novaVaga, codEmpresa: e.target.value })}
                className="form-input"
              >
                <option value="">Selecione uma Empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.cod_empresa} value={empresa.cod_empresa}>
                    {empresa.nome}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Link do Logo (URL)"
                value={novaVaga.logoLink}
                onChange={(e) => setNovaVaga({ ...novaVaga, logoLink: e.target.value })}
                className="form-input"
              />
            </div>
            <button onClick={inserirVaga} className="btn-primary">
              Salvar Vaga
            </button>
          </div>
        )}

        {/* ===================== FUNCIONÁRIO ===================== */}
        {tabelaSelecionada === "tb_funcionario" && (
          <div className="form-card">
            <h2>Inserir Novo Funcionário</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Primeiro Nome"
                value={novoFuncionario.primeiroNome}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, primeiroNome: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Segundo Nome"
                value={novoFuncionario.segundoNome}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, segundoNome: e.target.value })}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={novoFuncionario.email}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
                className="form-input"
              />
              <select
                value={novoFuncionario.cargo}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })}
                className="form-input"
              >
                <option value="0">Gerente</option>
                <option value="1">Comum</option>
              </select>
              <select
                value={novoFuncionario.codEmpresa}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, codEmpresa: e.target.value })}
                className="form-input"
              >
                <option value="">Selecione uma Empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.cod_empresa} value={empresa.cod_empresa}>
                    {empresa.nome}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={inserirFuncionario} className="btn-primary">
              Salvar Funcionário
            </button>
          </div>
        )}

        {/* ===================== ENDEREÇO ===================== */}
        {tabelaSelecionada === "endereco" && (
          <div className="form-card">
            <h2>Inserir Novo Endereço</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Rua *"
                value={novoEndereco.rua}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, rua: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Número"
                value={novoEndereco.numero}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, numero: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Bairro"
                value={novoEndereco.bairro}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, bairro: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Cidade *"
                value={novoEndereco.cidade}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, cidade: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Estado (UF) *"
                maxLength="2"
                value={novoEndereco.estado}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, estado: e.target.value.toUpperCase() })}
                className="form-input"
              />
              <select
                value={novoEndereco.codEmpresa}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, codEmpresa: e.target.value })}
                className="form-input"
              >
                <option value="">Selecione uma Empresa (Opcional)</option>
                {empresas.map((empresa) => (
                  <option key={empresa.cod_empresa} value={empresa.cod_empresa}>
                    {empresa.nome}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={inserirEndereco} className="btn-primary">
              Salvar Endereço
            </button>
          </div>
        )}

        {/* ===================== DEPARTAMENTO ===================== */}
        {tabelaSelecionada === "tb_departamento" && (
          <div className="form-card">
            <h2>Inserir Novo Departamento</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Nome do Departamento *"
                value={novoDepartamento.nome}
                onChange={(e) => setNovoDepartamento({ ...novoDepartamento, nome: e.target.value })}
                className="form-input"
              />
              <select
                value={novoDepartamento.codFuncionario}
                onChange={(e) => setNovoDepartamento({ ...novoDepartamento, codFuncionario: e.target.value })}
                className="form-input"
              >
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
                onChange={(e) => setNovoDepartamento({ ...novoDepartamento, supervisorId: e.target.value })}
                className="form-input"
              >
                <option value="">Selecione um Departamento Supervisor (Opcional)</option>
                {departamentos.map((dept) => (
                  <option key={dept.cod_dep} value={dept.cod_dep}>
                    {dept.nome}
                  </option>
                ))}
              </select>
            </div>
            <p className="form-hint">
              💡 O departamento supervisor cria uma hierarquia entre departamentos
            </p>
            <button onClick={inserirDepartamento} className="btn-primary">
              Salvar Departamento
            </button>
          </div>
        )}

        {/* ===================== TABELA ATUALIZADA ===================== */}
        <div className="results-section">
          <h1>Tabela Atualizada</h1>
          {renderResult()}
        </div>
      </div>
    </div>
  );
};

export default JBDC;