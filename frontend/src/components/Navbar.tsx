import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        Home
      </Link>
      <Link to="/game-couch/create" className="nav-link">
        Create Game Couch
      </Link>
      <Link to="/my-game-couches" className="nav-link">
        My Game Couches
      </Link>
    </nav>
  );
};

export default Navbar;
