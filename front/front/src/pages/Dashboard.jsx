import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Briefcase, GraduationCap, Building2, Filter } from 'lucide-react';

const Dashboard = () => {
  const [dados, setDados] = useState({
    estudantes: [],
    empresas: [],
    vagas: [],
    cursos: [],
    funcionarios: []
  });
  
  const [filtros, setFiltros] = useState({
    periodoInicio: '',
    periodoFim: '',
    cursoSelecionado: 'todos',
    modalidadeSelecionada: 'todas'
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // const API_URL = "https://oportunitech.onrender.com/api";
  const API_URL = "http://localhost:8080/sql";

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [estudantesRes, empresasRes, vagasRes, cursosRes, funcionariosRes] = await Promise.all([
          fetch(`${API_URL}/estudantes`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/empresas`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/vagas`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/cursos`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/funcionarios`).then(r => r.json()).catch(() => [])
        ]);

        setDados({
          estudantes: estudantesRes,
          empresas: empresasRes,
          vagas: vagasRes,
          cursos: cursosRes,
          funcionarios: funcionariosRes
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    buscarDados();
  }, []);

  // Cálculos Estatísticos
  const calcularEstatisticas = (valores) => {
    if (!valores || valores.length === 0) return { media: 0, mediana: 0, moda: 0, variancia: 0, desvioPadrao: 0 };
    
    const n = valores.length;
    const media = valores.reduce((a, b) => a + b, 0) / n;
    
    const ordenados = [...valores].sort((a, b) => a - b);
    const mediana = n % 2 === 0 
      ? (ordenados[n/2 - 1] + ordenados[n/2]) / 2 
      : ordenados[Math.floor(n/2)];
    
    const frequencias = {};
    valores.forEach(v => frequencias[v] = (frequencias[v] || 0) + 1);
    const moda = Object.keys(frequencias).reduce((a, b) => 
      frequencias[a] > frequencias[b] ? a : b
    );
    
    const variancia = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / n;
    const desvioPadrao = Math.sqrt(variancia);
    
    return { media, mediana, moda: Number(moda), variancia, desvioPadrao };
  };

  // Indicadores Resumidos
  const indicadores = {
    totalEstudantes: dados.estudantes.length,
    totalEmpresas: dados.empresas.length,
    totalVagas: dados.vagas.length,
    totalCursos: dados.cursos.length,
    totalFuncionarios: dados.funcionarios.length,
    mediaIdadeEstudantes: dados.estudantes.length > 0 
      ? (dados.estudantes.reduce((acc, e) => acc + (e.idade || 0), 0) / dados.estudantes.length).toFixed(1)
      : 0,
    vagasPorEmpresa: dados.empresas.length > 0
      ? (dados.vagas.length / dados.empresas.length).toFixed(1)
      : 0
  };

  // 1. Gráfico de Distribuição de Idade dos Estudantes (Histograma)
  const distribuicaoIdade = () => {
    const idades = dados.estudantes.map(e => e.idade || 0).filter(i => i > 0);
    const faixas = {};
    
    idades.forEach(idade => {
      const faixa = Math.floor(idade / 5) * 5;
      const label = `${faixa}-${faixa + 4}`;
      faixas[label] = (faixas[label] || 0) + 1;
    });

    return Object.entries(faixas)
      .map(([faixa, count]) => ({ faixa, quantidade: count }))
      .sort((a, b) => parseInt(a.faixa) - parseInt(b.faixa));
  };

  // 2. Estatísticas de Idade (Média, Mediana, Moda)
  const estatisticasIdade = () => {
    const idades = dados.estudantes.map(e => e.idade || 0).filter(i => i > 0);
    const stats = calcularEstatisticas(idades);
    
    return [
      { medida: 'Média', valor: parseFloat(stats.media.toFixed(1)) },
      { medida: 'Mediana', valor: parseFloat(stats.mediana.toFixed(1)) },
      { medida: 'Moda', valor: stats.moda },
      { medida: 'Desvio Padrão', valor: parseFloat(stats.desvioPadrao.toFixed(1)) }
    ];
  };

  const estudantesPorCurso = () => {
    const distribuicao = {};
    
    dados.estudantes.forEach(est => {
      if (est.cod_curso) {
        // Busca o nome do curso usando cod_curso
        // Note que o ID na tabela de cursos pode ser 'cod_curso' ou 'id'
        const curso = dados.cursos.find(c => c.cod_curso === est.cod_curso || c.id === est.cod_curso);
        const nomeCurso = curso?.nome || `Curso ${est.cod_curso}`;
        distribuicao[nomeCurso] = (distribuicao[nomeCurso] || 0) + 1;
      } else {
        distribuicao['Sem Curso'] = (distribuicao['Sem Curso'] || 0) + 1;
      }
    });

    return Object.entries(distribuicao).map(([nome, value]) => ({ nome, value }));
  };

  // 4. Vagas por Modalidade (Barras)
  const vagasPorModalidade = () => {
    const mapaModalidade = {
      0: 'Presencial',
      1: 'Remoto',
      2: 'Hibrido'
    };

    const distribuicao = {};
    
    dados.vagas.forEach(vaga => {
      const codigo = vaga.modalidades;
      const modalidade = mapaModalidade[codigo] || 'Não especificado';
      
      distribuicao[modalidade] = (distribuicao[modalidade] || 0) + 1;
    });

    return Object.entries(distribuicao).map(([modalidade, quantidade]) => ({
      modalidade,
      quantidade
    }));
  };


  // 5. Top 10 Empresas com Mais Vagas
  const empresasComMaisVagas = () => {
    const vagasPorEmpresa = {};
    dados.vagas.forEach(vaga => {
      const empresa = vaga.nome_empresa || 'Sem nome';
      vagasPorEmpresa[empresa] = (vagasPorEmpresa[empresa] || 0) + 1;
    });

    return Object.entries(vagasPorEmpresa)
      .map(([empresa, vagas]) => ({ empresa, vagas }))
      .sort((a, b) => b.vagas - a.vagas)
      .slice(0, 10);
  };



  // 6. Análise de Carga Horária das Vagas
  const distribuicaoCargaHoraria = () => {
    const cargas = dados.vagas.map(v => v.carga_horaria || 0).filter(c => c > 0);
    const stats = calcularEstatisticas(cargas);
    
    const faixas = {};
    cargas.forEach(carga => {
      let faixa;
      if (carga <= 20) faixa = '0-20h';
      else if (carga <= 30) faixa = '21-30h';
      else if (carga <= 40) faixa = '31-40h';
      else faixa = '40h+';
      
      faixas[faixa] = (faixas[faixa] || 0) + 1;
    });

    return {
      distribuicao: Object.entries(faixas).map(([faixa, count]) => ({ faixa, quantidade: count })),
      stats
    };
  };

  // 7. Radar - Perfil dos Cursos (Duração vs Estudantes)
  const perfilCursos = () => {
  return dados.cursos.map(curso => {
    const qtdEstudantes = dados.estudantes.filter(
      (e) => e.cod_curso === curso.cod_curso || e.curso === curso.cod_curso
    ).length;

    return {
      curso: curso.nome ? curso.nome.substring(0, 19) : 'Sem nome',
      duracao: curso.duracao || 0,
      estudantes: qtdEstudantes,
      popularidade: qtdEstudantes > 0 ? Math.min(100, qtdEstudantes * 10) : 0
    };
  }).filter(c => c.duracao > 0);
};


  // 8. Linha do Tempo - Tendência de Vagas por Empresa
  const tendenciaVagas = () => {
    const vagasPorEmpresa = {};
    dados.vagas.forEach((vaga) => {
      const empresa = vaga.nome_empresa || 'Sem nome';
      if (!vagasPorEmpresa[empresa]) {
        vagasPorEmpresa[empresa] = 0;
      }
      vagasPorEmpresa[empresa]++;
    });

    return Object.entries(vagasPorEmpresa)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([empresa, vagas]) => ({
        empresa: empresa.substring(0, 20),
        vagas
      }));
  };

  // 9. Variância e Desvio Padrão de Carga Horária
  const analiseVariancia = () => {
    const cargas = dados.vagas.map(v => v.carga_horaria || 0).filter(c => c > 0);
    const stats = calcularEstatisticas(cargas);
    
    return [
      { metrica: 'Variância', valor: parseFloat(stats.variancia.toFixed(2)) },
      { metrica: 'Desvio Padrão', valor: parseFloat(stats.desvioPadrao.toFixed(2)) },
      { metrica: 'Média', valor: parseFloat(stats.media.toFixed(2)) },
      { metrica: 'Mediana', valor: parseFloat(stats.mediana.toFixed(2)) }
    ];
  };

  const CORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Análise completa dos dados do banco de dados com insights estatísticos
          </p>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <button onClick={() => setMostrarFiltros(!mostrarFiltros)} className="filtros-toggle">
            <Filter size={20} />
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          
          {mostrarFiltros && (
            <div className="filtros-grid">
              <div className="filtro-item">
                <label className="filtro-label">Curso</label>
                <select
                  value={filtros.cursoSelecionado}
                  onChange={(e) => setFiltros({...filtros, cursoSelecionado: e.target.value})}
                  className="filtro-select"
                >
                  <option value="todos">Todos os Cursos</option>
                  {dados.cursos.map(curso => (
                    <option key={curso.cod_curso} value={curso.cod_curso}>{curso.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="filtro-item">
                <label className="filtro-label">Modalidade</label>
                <select
                  value={filtros.modalidadeSelecionada}
                  onChange={(e) => setFiltros({...filtros, modalidadeSelecionada: e.target.value})}
                  className="filtro-select"
                >
                  <option value="todas">Todas as Modalidades</option>
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Híbrido</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Cards de Indicadores */}
        <div className="indicadores-grid">
          <div className="indicador-card">
            <div className="indicador-header">
              <span className="indicador-titulo">Total de Estudantes</span>
              <Users size={20} color="#3b82f6" />
            </div>
            <p className="indicador-valor">{indicadores.totalEstudantes}</p>
            <p className="indicador-info">Idade média: {indicadores.mediaIdadeEstudantes} anos</p>
          </div>

          <div className="indicador-card">
            <div className="indicador-header">
              <span className="indicador-titulo">Total de Empresas</span>
              <Building2 size={20} color="#10b981" />
            </div>
            <p className="indicador-valor">{indicadores.totalEmpresas}</p>
            <p className="indicador-info">Funcionários: {indicadores.totalFuncionarios}</p>
          </div>

          <div className="indicador-card">
            <div className="indicador-header">
              <span className="indicador-titulo">Total de Vagas</span>
              <Briefcase size={20} color="#f59e0b" />
            </div>
            <p className="indicador-valor">{indicadores.totalVagas}</p>
            <p className="indicador-info">Média por empresa: {indicadores.vagasPorEmpresa}</p>
          </div>

          <div className="indicador-card">
            <div className="indicador-header">
              <span className="indicador-titulo">Total de Cursos</span>
              <GraduationCap size={20} color="#8b5cf6" />
            </div>
            <p className="indicador-valor">{indicadores.totalCursos}</p>
            <p className="indicador-info">Estudantes ativos: {indicadores.totalEstudantes}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="graficos-grid">
          
          {/* Gráfico 1: Distribuição de Idade */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">📈 Distribuição de Idade dos Estudantes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribuicaoIdade()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="faixa" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="quantidade" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 2: Estatísticas de Idade */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">📊 Medidas Estatísticas - Idade</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estatisticasIdade()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="medida" stroke="#64748b" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="valor" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 3: Estudantes por Curso */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">🎓 Distribuição de Estudantes por Curso</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estudantesPorCurso()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({nome, percent}) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {estudantesPorCurso().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 4: Vagas por Modalidade */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">💼 Vagas por Modalidade</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vagasPorModalidade()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="modalidade" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="quantidade" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 5: Top Empresas */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">🏢 Top 10 Empresas com Mais Vagas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={empresasComMaisVagas()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="empresa" stroke="#64748b" width={150} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="vagas" fill="#ef4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 6: Carga Horária */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">⏰ Distribuição de Carga Horária</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={distribuicaoCargaHoraria().distribuicao}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="faixa" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="quantidade" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 7: Radar Cursos */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">🎯 Perfil dos Cursos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={perfilCursos()}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="curso" stroke="#64748b" />
                <PolarRadiusAxis stroke="#64748b" />
                <Radar name="Estudantes" dataKey="estudantes" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 8: Tendência Vagas */}
          <div className="grafico-card">
            <h3 className="grafico-titulo">📈 Vagas por Empresa (Ranking)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendenciaVagas()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="empresa" stroke="#64748b" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="vagas" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 9: Análise de Variância */}
          <div className="grafico-card grafico-card-full">
            <h3 className="grafico-titulo">📉 Análise de Variância - Carga Horária</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analiseVariancia()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metrica" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="valor" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;