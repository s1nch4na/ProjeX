import React, { useState } from 'react';
import { signupUser } from '../utils/api';

export default function Signup({ onSwitchToLogin, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await signupUser({ name, email, password, role });
    if (user) {
      alert("Account created successfully!");
      if (onSuccess) onSuccess(user);
    }
  };

  return (
    <div className="auth-container">
      <h2>Account Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="creator">Creator / Seller</option>
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {onSwitchToLogin && (
        <p onClick={onSwitchToLogin} style={{ cursor: 'pointer', color: 'blue' }}>
          Already have an account? Log in
        </p>
      )}
    </div>
  );
}