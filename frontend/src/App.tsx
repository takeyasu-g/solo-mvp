import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateGameCouch from './pages/CreateGameCouch';
import GameCouch from './pages/GameCouch';
import MyGameCouches from './pages/MyGameCouches';

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-couch/create" element={<CreateGameCouch />} />
        <Route path="/game-couch/:id" element={<GameCouch />} />
        <Route path="/my-game-couches" element={<MyGameCouches />} />
      </Routes>
    </>
  );
};

export default App;
