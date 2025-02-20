import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpFormData, ApiResponse } from '../vite-env';
import { auth } from '../firebase';
import { signInWithCustomToken } from 'firebase/auth';

const Home: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    setError('');

    if (!email || !password || !username) {
      setError('All fields are required.');
      return;
    }

    const formData: SignUpFormData = { email, password, username };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Signup failed:', errorText); // Log signup failure
        throw new Error('Signup failed. Please try again.');
      }

      const data: ApiResponse<null> = await response.json();
      setEmail('');
      setPassword('');
      setUsername('');
      setIsSignUp(false); // Redirect to login
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Signup error:', error.message); // Log signup error
      setError('Signup failed. Please try again.');
      setEmail('');
      setPassword('');
      setUsername('');
    }
  };

  const handleLogin = async (): Promise<void> => {
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      console.log('Attempting to log in:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText); // Log login failure
        throw new Error('Login failed. Please try again.');
      }

      const data: ApiResponse<{ customToken: string }> = await response.json();
      console.log('Custom token received:', data.customToken); // Log custom token

      // Sign in with the custom token
      await signInWithCustomToken(auth, data.customToken);

      console.log('Login successful:', email); // Log successful login
      // Redirect to /game-couch/create
      navigate('/game-couch/create');
    } catch (error) {
      console.error('Login error:', error.message); // Log login error
      setError('Login failed. Please try again.');
      setEmail('');
      setPassword('');
    }
  };

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

        {error && <p className="error-message">{error}</p>}

        <button onClick={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>

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
