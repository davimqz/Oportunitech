import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Update = () => {
  const API_URL = "http://localhost:8080/sql";

  const [sql, setSql] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const executarUpdate = async () => {
    if (!sql.toLowerCase().includes("update")) {
      showToast("O comando deve conter UPDATE!", "error");
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      });

      const text = await res.text();

      if (!res.ok) {
        showToast("Erro ao executar SQL", "error");
        setResultado(text);
      } else {
        showToast("UPDATE executado com sucesso!", "success");
        setResultado(text);
      }
    } catch (err) {
      showToast("Erro: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {toast && (
        <div
          style={{
            ...styles.toast,
            background:
              toast.type === "success"
                ? "#10b981"
                : toast.type === "error"
                ? "#ef4444"
                : "#f59e0b",
          }}
        >
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <XCircle size={18} />}
          {toast.type === "warning" && <AlertCircle size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      <h1>Executar UPDATE em SQL</h1>

      <textarea
        style={styles.textarea}
        placeholder="Digite seu comando UPDATE aqui..."
        value={sql}
        onChange={(e) => setSql(e.target.value)}
      />

      <button style={styles.button} onClick={executarUpdate} disabled={loading}>
        {loading ? "Executando..." : "Executar UPDATE"}
      </button>

      {resultado && (
        <div style={styles.resultBox}>
          <h3>Resultado:</h3>
          <pre>{resultado}</pre>
        </div>
      )}
    </div>
  );
};

// Estilos rápidos inline (sem Tailwind)
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #d1d5db",
    fontSize: "14px",
    marginBottom: "20px",
  },
  button: {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  resultBox: {
    background: "#f3f4f6",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    marginTop: "20px",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
    zIndex: 9999,
  },
};

export default Update;
