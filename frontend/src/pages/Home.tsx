import { useState } from 'react';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only for signup
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login & signup

  return (
    <div className="home-container">
      <div className="title-container">
        <h1 className="title">Game Couch</h1>
      </div>

      <div className="auth-box">
        <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>

        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>{isSignUp ? 'Sign Up' : 'Log In'}</button>

        <p onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? 'Already have an account? Log in'
            : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
};

export default Home;
