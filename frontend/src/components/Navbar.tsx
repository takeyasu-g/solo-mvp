import { Link } from 'react-router-dom';
import React from 'react';

interface NavbarProps {
  // Define any props your Navbar component might need
}

const Navbar: React.FC<NavbarProps> = () => {
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
