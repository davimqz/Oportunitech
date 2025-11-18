import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Visualizar from './components/Visualizar';
import JBDC from './pages/JBDC';
import Footer from './components/Footer';
import Sql from './pages/Sql';
import Vagas from './pages/Vagas';
import Dashboard from './pages/Dashboard';
import Update from './pages/Update';

const App = () => {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sql" element={<Sql />} />
        <Route path="/visualizar" element={<Visualizar />} />
        <Route path="/jbdc" element={<JBDC />} />
        <Route path="/vagas" element={<Vagas />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
