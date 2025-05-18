import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Кнопка меню */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Боковая панель */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 transition-transform z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h2 className="text-xl font-bold mb-6">Меню</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:underline">Главная</Link>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:underline">Профиль</Link>
          <Link to="/editor" onClick={() => setIsOpen(false)} className="hover:underline">Редактор карты</Link>
          <Link to="/mymaps" onClick={() => setIsOpen(false)} className="hover:underline">Все карты</Link>
          <button onClick={handleLogout} className="mt-8 text-red-400 hover:underline text-left">Выйти</button>
        </nav>
      </div>
    </>
  );
}
