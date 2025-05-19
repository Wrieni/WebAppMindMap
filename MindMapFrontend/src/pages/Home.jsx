import React from 'react';

import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import '../module/HomePage.css';

const Home = () => {
  const navigate = useNavigate();
  // Пример данных публичных карт
  const publicMaps = [
    { id: 1, title: 'Планирование проекта', ispublic: true },
    { id: 2, title: 'Изучение React', ispublic: true },
    { id: 3, title: 'Книга по философии', ispublic: true },
  ];

  return (
    <div className="home-container">
      {/* Хедер */}
      <header className="main-header">
        <div className="header-content">
          <h1 className="logo">MindMap</h1>
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate('/login')}>Войти</button>
            <button className="register-btn" onClick={() => navigate('/register')}>Зарегистрироваться</button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="grid main-content">
        {/* Герой-секция */}
        <section className="hero-section">
            <div className="section-content">
                <h2 className="hero-title">Визуализируй свои мысли</h2>
                <p className="hero-subtitle">
                    MindMap — это инструмент для создания и хранения ментальных карт
                </p>
                <button 
                    className="cta-button"
                    onClick={() => navigate('/register')}
                >
                    Создай первую карту
                </button>
            </div>
          
        </section>

        {/* Преимущества */}
        <section className="features-section">
          <div className="section-content">
            <h3 className="features-title">Преимущества MindMap</h3>
            <div className="features-grid">
                <div className="feature-card">
                <h4>Организуй свои идеи</h4>
                <p>Структурируй и классифицируй мысли</p>
                </div>
                <div className="feature-card">
                <h4>Повысь продуктивность</h4>
                <p>MindMap поможет сфокусироваться на задачах и текущем прогрессе</p>
                </div>
                <div className="feature-card">
                <h4>Делись с друзьями</h4>
                <p>Делай свои карты публичными и доступными для просмотра</p>
                </div>
            </div>
          </div>
        </section>

        {/* Публичные карты */}
        <section className="public-maps-section">
            <div className='section-content'>
                <h3 className="section-title">Примеры публичных карт</h3>
                <div className="grid public-maps-grid">
                    {publicMaps.map((map) => (
                    <div key={map.id} className="public-card">
                        <div className="card-content">
                        <h3 className="card-title">{map.title}</h3>
                        <p className="card-status">Публичная карта</p>
                        </div>
                        <button
                        onClick={() => navigate(`mymaps/editor/map/${map.id}`)}
                        className="open-button"
                        type="button"
                        >
                        <Eye size={16} /> Посмотреть
                        </button>
                    </div>
                    ))}
                </div>
            </div>
          
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>MindMap</h4>
            <p>Превращаем идеи в реальность с 2023 года</p>
            <div className="social-links">
              {/* <Github size={20} />
              <Twitter size={20} />
              <Linkedin size={20} /> */}
            </div>
          </div>
          <div className="footer-column">
            <h4>Ресурсы</h4>
            {/* <a href="/blog">Блог</a> */}
            <a href="/docs">Документация</a>
            <a href="/pricing">Тарифы</a>
          </div>
          <div className="footer-column">
            <h4>Поддержка</h4>
            <a href="/contact">Контакты</a>
            <a href="/faq">FAQ</a>
            <div className="contact-info">
              {/* <Mail size={16} /> */}
              <span>support@mindmap.com</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 MindMap. Все права защищены</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;