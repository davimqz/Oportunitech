import React, { useState } from 'react';
import { Database, Play, CheckCircle, XCircle, AlertCircle, Code2 } from 'lucide-react';

// Componente Toast
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
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

const Sql = () => {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  async function handleSql() {
    if (!sql.trim()) {
      showToast("Digite um comando SQL", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://oportunitech-1.onrender.com/sql/execute", {
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
      showToast("Consulta executada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao executar SQL:", error);
      setResult({ error: error.message || "Erro ao executar a consulta" });
      showToast("Erro ao executar a consulta", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    // Ctrl + Enter para executar
    if (e.ctrlKey && e.key === 'Enter') {
      handleSql();
    }
  };

  const limparConsulta = () => {
    setSql("");
    setResult(null);
    showToast("Consulta limpa", "success");
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.error) {
      return (
        <div className="error-box">
          <div className="error-header">
            <XCircle className="error-icon" />
            <h3>Erro na Consulta</h3>
          </div>
          <p className="error-message">{result.error}</p>
        </div>
      );
    }

    if (Array.isArray(result) && result.length > 0) {
      return (
        <div className="results-wrapper">
          <div className="results-info">
            <CheckCircle className="success-icon" />
            <span>{result.length} registro(s) retornado(s)</span>
          </div>
          <div className="table-wrapper">
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
                        {value !== null ? value.toString() : <span className="null-value">NULL</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (Array.isArray(result) && result.length === 0) {
      return (
        <div className="info-box">
          <AlertCircle className="info-icon" />
          <div>
            <h4>Consulta Executada</h4>
            <p>Nenhum resultado foi retornado.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="json-result">
        <div className="json-header">
          <Code2 className="json-icon" />
          <span>Resposta JSON</span>
        </div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="sql-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="sql-container">
        {/* Editor SQL */}
        <div className="sql-editor-card">
          <div className="editor-header">
            <div className="editor-title">
              <Code2 className="editor-icon" />
              <span>Editor SQL</span>
            </div>
            <div className="editor-hint">
              <span>Pressione Ctrl + Enter para executar</span>
            </div>
          </div>
          
          <textarea 
            onChange={(e) => setSql(e.target.value)} 
            onKeyDown={handleKeyPress}
            rows="10"
            placeholder="Digite sua consulta SQL aqui...&#10;&#10;Exemplo:&#10;SELECT * FROM tb_estudante;&#10;INSERT INTO tb_curso (nome, duracao) VALUES ('React', 40);"
            value={sql}
            className="sql-textarea"
          />

          <div className="editor-footer">
            <button 
              onClick={limparConsulta} 
              className="btn-clear"
              disabled={!sql && !result}
            >
              Limpar
            </button>
            <button 
              onClick={handleSql} 
              disabled={loading || !sql.trim()}
              className="btn-execute"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Executando...
                </>
              ) : (
                <>
                  <Play className="btn-icon" />
                  Executar Consulta
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="results-section">
          <h2 className="results-title">Resultado da Consulta</h2>
          {result ? (
            renderResult()
          ) : (
            <div className="empty-results">
              <Database className="empty-icon" />
              <h3>Nenhuma consulta executada</h3>
              <p>Digite um comando SQL e clique em "Executar Consulta" para ver os resultados aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sql;