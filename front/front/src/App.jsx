import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Grafico from './pages/Grafico';
import Sobre from './pages/Sobre';
import Visualizar from './components/Visualizar';
import JBDC from './pages/JBDC';
import Footer from './components/Footer';
import Sql from './pages/Sql';
import Vagas from './pages/Vagas';

const App = () => {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sql" element={<Sql />} />
        <Route path="/graficos" element={<Grafico />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/visualizar" element={<Visualizar />} />
        <Route path="/jbdc" element={<JBDC />} />
        <Route path="/vagas" element={<Vagas />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
