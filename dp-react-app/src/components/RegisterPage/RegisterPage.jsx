import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';


function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    city: '',
    vip_status:1,
    balance: 500,
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают!");
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await fetch('http://81.94.158.193:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации');
      }

      // Если регистрация успешна
      alert('Регистрация успешна!');
      navigate('/unogame'); // Перенаправляем на страницу игры
    } catch (err) {
      setError(err.message || 'Произошла ошибка при регистрации');
    }
  };
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h1 className="register-title">РЕГИСТРАЦИЯ</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Имя пользователя*</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            minLength={3}
          />
        </div>
        
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          />
        </div>
        
        <div className="form-group">
          <label>Город проживания</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Пароль*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={6}
          />
        </div>
        
        <div className="form-group">
          <label>Подтвердить пароль*</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" className="register-button">
          ЗАРЕГИСТРИРОВАТЬСЯ
        </button>
        
        <div className="login-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;