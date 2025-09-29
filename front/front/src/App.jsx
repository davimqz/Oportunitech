import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Grafico from './pages/Grafico';
import Sobre from './pages/Sobre';
import Visualizar from './components/Visualizar';

const App = () => {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graficos" element={<Grafico />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/visualizar" element={<Visualizar />} />
      </Routes>
    </div>
  )
}

export default App
