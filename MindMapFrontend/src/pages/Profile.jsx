import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMenu } from 'react-icons/fi';
import '../module/ProfilePage.css';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div className="profile-page">
      <header className="header">
        
        <button
          className={`sidebar-toggle ${sidebarOpen ? "rotate" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        <div className="user-icon">
          {user.name[0].toUpperCase()}
        </div>
      </header>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <a href="/">Главная</a>
        <a href="/mymaps">Мои карты</a>
        <a href="/profile">Профиль</a>
             
      </div>

      <div className="profile-content">
        <div className="profile-info">
          {/* Большая иконка пользователя */}
          {/* <div className="profile-banner">
            <div className="user-icon2">{user.name[0].toUpperCase()}</div>
            <div className="user-photo">
              {/* Тут может быть <img src="..." /> или первая буква имени */}
              {/* <span>S</span>
            </div>
        </div> */} 

    {/* Имя и фамилия (повторно) */}
    {/* <div className="profile-edit">
      <p>Редактировать фото</p>
    </div> */}
    <div className="profile-name">
      <h2>{user.name} {user.surname}</h2>
    </div>

    {/* Поля с данными */}
      

          <div className="profile-detail-row">
            <div className="profile-detail-text">
              <strong>Имя Пользователя</strong>
              <p>{user.name}{user.surname}</p>
            </div>
            <button className="edit-button">Изменить</button>
          </div>

          <div className="profile-detail-row">
            <div className="profile-detail-text">
              <strong>Электронная Почта</strong>
              <p>{user.email}</p>
            </div>
            <button className="edit-button">Изменить</button>
          </div>

          <div className="profile-detail-row">
            <div className="profile-detail-text">
              <strong>Пароль</strong>
              <p>********</p>
            </div>
            <button className="edit-button">Изменить</button>
          </div>

          <button className="logout-button" onClick={logout}>Выйти из профиля</button>
        </div>
      </div>
    </div>
  );
}
