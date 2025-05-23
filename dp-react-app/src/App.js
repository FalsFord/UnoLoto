import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GamePage from './components/GamePage/GamePage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import UnoGame from './components/UnoGame/UnoGame';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unogame" element={<UnoGame />} /> 
      </Routes>
    </Router>
  );
}

export default App;