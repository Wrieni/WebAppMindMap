import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div className="pl-72 p-6"> {/* отступ слева для панельки */}
      <Sidebar />
      <h2 className="text-2xl font-bold mb-4">Профиль пользователя</h2>
      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Фамилия:</strong> {user.surname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Роль:</strong> {user.role}</p>
    </div>
  );
}
