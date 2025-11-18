import React, { useEffect, useState } from 'react';
import { Search, Filter, Briefcase, DollarSign, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

// Componente Toast
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="toast-icon" />,
    error: <XCircle className="toast-icon" />
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type]}
      <p className="toast-message">{message}</p>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};

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

const Vagas = () => {
  const [vagas, setVagas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordenacao, setOrdenacao] = useState('');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://oportunitech-1.onrender.com";

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    buscarVagas();
  }, [ordenacao]);

  const buscarVagas = () => {
    setLoading(true);
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
      .then((data) => {
        setVagas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showToast("Erro ao buscar vagas.", "error");
        setLoading(false);
      });
  };

  const buscarPorEmpresa = () => {
    if (!searchTerm.trim()) {
      buscarVagas();
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/sql/vagas/empresa/${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar vagas.");
        }
        return response.json();
      })
      .then((data) => {
        setVagas(data);
        setLoading(false);
        if (data.length === 0) {
          showToast("Nenhuma vaga encontrada para esta empresa.", "error");
        }
      })
      .catch((error) => {
        console.error(error);
        showToast("Erro ao buscar vagas.", "error");
        setLoading(false);
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

  const handleCandidatar = (vaga) => {
    showToast(`Candidatura enviada para ${vaga.titulo}!`, "success");
  };

  return (
    <div className="vagas-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="vagas-container">
        {/* Header com busca e filtros */}
        <div className="vagas-header">
          <div className="header-content">
            <h1 className="vagas-title">
              <Briefcase className="title-icon" />
              Vagas Disponíveis
            </h1>
            <p className="vagas-subtitle">
              {vagas.length} {vagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
            </p>
          </div>

          <div className="search-filter-container">
            <div className="search-box">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar por empresa..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchSubmit}
                className="search-input"
              />
              <button onClick={buscarPorEmpresa} className="search-button">
                Buscar
              </button>
            </div>

            <div className="filter-box">
              <Filter className="filter-icon" />
              <select value={ordenacao} onChange={handleOrdenacaoChange} className="filter-select">
                <option value="">Ordenar por</option>
                <option value="salario">Maior Salário</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de vagas */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando vagas...</p>
          </div>
        ) : vagas.length > 0 ? (
          <div className="vagas-grid">
            {vagas.map((vaga) => (
              <div key={vaga.cod_vaga} className="vaga-card">
                <div className="vaga-header">
                  {vaga.logo_link && (
                    <img src={vaga.logo_link} alt={vaga.nome_empresa} className="company-logo" />
                  )}
                  <h2 className="vaga-titulo">{vaga.titulo}</h2>
                  <p className="vaga-empresa">{vaga.nome_empresa}</p>
                </div>

                <div className="vaga-content">
                  <p className="vaga-descricao">{vaga.descricao}</p>
                  
                  <div className="vaga-details">
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span>{vaga.carga_horaria}h/semana</span>
                    </div>
                    
                    <div className="detail-item">
                      <DollarSign className="detail-icon" />
                      <span className="salary">R$ {vaga.salario}</span>
                    </div>

                    {vaga.modalidades !== undefined && (
                      <div className="detail-item">
                        <MapPin className="detail-icon" />
                        <span>
                          {vaga.modalidades === 0 ? 'Presencial' : 
                           vaga.modalidades === 1 ? 'Remoto' : 'Híbrido'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  className="candidatar-button"
                  onClick={() => handleCandidatar(vaga)}
                >
                  Candidatar-se
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Briefcase className="empty-icon" />
            <h3>Nenhuma vaga encontrada</h3>
            <p>Tente ajustar os filtros ou buscar por outra empresa</p>
            <button onClick={buscarVagas} className="reset-button">
              Ver todas as vagas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vagas;