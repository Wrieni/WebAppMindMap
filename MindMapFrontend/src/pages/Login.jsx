import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../module/LoginPage.css';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate("/profile");
    } else {
      setError("Неверные данные для входа");
    }
  };

  return (
    
    <div className="login-container">
      <header className="main-header">
        <div className="header-content">
          <h1 className="logo">MindMap</h1>
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate('/login')}>Войти</button>
            <button className="register-btn" onClick={() => navigate('/register')}>Зарегистрироваться</button>
          </div>
        </div>
      </header>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Вход</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={handleChange}
          required
          className="login-input"
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-button">Войти</button>
      </form>
    </div>
  );
}
