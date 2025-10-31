import React, { useEffect, useState } from 'react';

const Vagas = () => {
  const [vagas, setVagas] = useState([]);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8080/api"
      : "https://oportunitech-1.onrender.com/api";

  useEffect(() => {
    fetch(`${API_URL}/vagas`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar vagas.");
        }
        return response.json();
      })
      .then((data) => setVagas(data))
      .catch((error) => {
        console.error(error);
        alert("Erro ao buscar vagas.");
      });
  }, [API_URL]);

  return (
    <div>
      <div className="empresaContainer">
        <div className="logoEmpresa">
          <img
            src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1761774425/AvanadeLogoNoTM_AWColor_RGB_b1kyrp.png"
            alt="Logo empresa"
          />
        </div>

        <div className="rowVagas">
          {vagas
            .filter((vaga) => vaga.nome_empresa === 'Avanade')
            .map((vaga) => (
              <div key={vaga.cod_vaga} className="vagaContainer">
                <div className="boxContainer">
                  <div className="logoText">
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1761774425/AvanadeLogoNoTM_AWColor_RGB_b1kyrp.png" alt="" />
                    <h1>{vaga.titulo}</h1>
                  </div>

                  <p>{vaga.descricao}</p>
                  <p><strong>Carga horária:</strong> {vaga.carga_horaria}h</p>
                  <p><strong>Salário:</strong> R$ {vaga.salario}</p>

                  <div className="buttonVaga">
                    <button>Candidata-se</button>
                  </div>
                </div>
              </div>

            ))}
        </div>
      </div>


       <div className="empresaContainer">
        <div className="logoEmpresa">
          <img
            src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1761856576/Accenture.svg_dpomrc.png"
            alt="Logo empresa"
          />
        </div>

        <div className="rowVagas">
          {vagas
            .filter((vaga) => vaga.nome_empresa === 'Accenture')
            .map((vaga) => (
              <div key={vaga.cod_vaga} className="vagaContainer">
                <div className="boxContainer">
                  <div className="logoText">
                    <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1761919827/Accenture.svg_dpomrc_ajlzjt.png" alt="" />
                    <h1>{vaga.titulo}</h1>
                  </div>

                  <p>{vaga.descricao}</p>
                  <p><strong>Carga horária:</strong> {vaga.carga_horaria}h</p>
                  <p><strong>Salário:</strong> R$ {vaga.salario}</p>

                  <div className="buttonVaga">
                    <button>Candidata-se</button>
                  </div>
                </div>
              </div>

            ))}
        </div>
      </div>
    </div>
  );
};

export default Vagas;
