import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Grafico from './pages/Grafico';

const App = () => {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graficos" element={<Grafico />} />
       
      </Routes>
    </div>
  )
}

export default App
