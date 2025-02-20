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

// not sure if right way , but useLocation wouldn't work without having it wrapped
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Separate component inside Router so useLocation() works
function AppContent() {
  const location = useLocation(); // Get current page route

  return (
    <>
      {location.pathname !== '/' && <Navbar />}{' '}
      {/* Now hides properly the Navbar on Home */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-couch/create" element={<CreateGameCouch />} />
        <Route path="/game-couch/:id" element={<GameCouch />} />
        <Route path="/my-game-couches" element={<MyGameCouches />} />
      </Routes>
    </>
  );
}

export default App;
