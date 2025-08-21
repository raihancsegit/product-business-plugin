import React, { useState } from 'react';
import axios from 'axios';

const JWT_API_URL = 'http://wp2025.local/wp-json/jwt-auth/v1/token';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(JWT_API_URL, {
        username,
        password,
      });
      const { token, user_display_name } = response.data;
      // টোকেনটি ব্রাউজারের localStorage-এ সেভ করা হচ্ছে
      localStorage.setItem('authToken', token);
      onLoginSuccess(user_display_name);
    } catch (err) {
      setError('Invalid username or password.');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-brand-blue text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;