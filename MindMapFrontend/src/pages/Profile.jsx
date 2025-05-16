import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Фамилия:</strong> {user.surname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Роль:</strong> {user.role}</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}
