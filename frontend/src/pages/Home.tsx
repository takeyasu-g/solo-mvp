import { useState } from 'react';
import { SignUpFormData, ApiResponse } from '../vite-env';

const Home: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

      const data: ApiResponse<null> = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed.');

      alert('Signup successful!');
    } catch (err) {
      setError((err as Error).message);
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

        <button onClick={isSignUp ? handleSignUp : undefined}>
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
