import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateGameCouch from './pages/CreateGameCouch';
import GameCouch from './pages/GameCouch';
import MyGameCouches from './pages/MyGameCouches';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar is always visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-couch/create" element={<CreateGameCouch />} />
        <Route path="/game-couch/:id" element={<GameCouch />} />
        <Route path="/my-game-couches" element={<MyGameCouches />} />
      </Routes>
    </Router>
  );
}

export default App;
