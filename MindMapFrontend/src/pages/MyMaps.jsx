import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Check, X, Eye } from 'lucide-react';
import "../module/MindMapList.css";
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from "lucide-react";


function MindMapList() {
  const navigate = useNavigate();
  const [mindMaps, setMindMaps] = useState([]);
  const [loading, setLoading] = useState(true);
    const { user = {} } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newIsPublic, setNewIsPublic] = useState(false);


  // Новый стейт для создания
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  

  const fetchMaps = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://localhost:7204/api/MindMap', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMindMaps(response.data);
    } catch (error) {
      console.error('Ошибка загрузки карт:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setNewTitle('');
  };

   const handleSaveNew = async () => {
    if (!newTitle.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'https://localhost:7204/api/MindMap',
        { title: newTitle.trim(), ispublic: newIsPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

+     // Переадресуем на страницу редактирования
+     navigate(`/editor/map/${res.data.id}`);
    } catch (error) {
      console.error('Ошибка создания карты:', error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewTitle('');
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  if (!user) {
  return <div>Загрузка...</div>;
}
  return (
    
    <div>
      <header className="header">
          
          <button
            className={`sidebar-toggle ${sidebarOpen ? "rotate" : ""}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>

          <div className="user-icon" onClick={() => navigate('/profile')}>
            {(user?.name && user.name[0].toUpperCase()) || '?'}
          </div>
        </header>

        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <a href="/">Главная</a>
          <a href="/mymaps">Мои карты</a>
          <a href="/profile">Профиль</a>

        </div>
        <div className="container">
        
        <div className="main-content">
          <h1 className="title">Ваши ментальные карты</h1>
          {isCreating ? (
            <div className="create-form-enhanced">
              <input
                type="text"
                className="create-input"
                placeholder="Введите название карты"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={!newIsPublic}
                    onChange={() => setNewIsPublic(false)}
                  />
                  Приватная
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={newIsPublic}
                    onChange={() => setNewIsPublic(true)}
                  />
                  Публичная
                </label>
              </div>

              <div className="create-buttons">
                <button onClick={handleSaveNew} className="btn-save" type="button">
                  <Check size={16} /> Создать
                </button>
                <button onClick={handleCancel} className="btn-cancel" type="button">
                  <X size={16} /> Отмена
                </button>
              </div>
            </div>
          ) : (
            <button onClick={handleCreateClick} className="createButton" type="button">
              <Plus size={20} /> Создать карту
            </button>
          )}
        </div>

        {loading ? (
          <div className="skeletonGrid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeletonItem" />
            ))}
          </div>
        ) : mindMaps.length === 0 ? (
          <div className="emptyMessage">
            <p className="emptyMessageLarge">У вас пока нет карт.</p>
            <p className="emptyMessageSmall">Создайте первую карту, нажав кнопку выше.</p>
          </div>
        ) : (
          <div className="grid">
            {mindMaps.map((map) => (
              <div key={map.id} className="card">
                <div>
                  <h2 className="cardTitle" title={map.title}>
                    {map.title}
                  </h2>
                  <p className="cardStatus">
                    Статус: {map.ispublic ? 'Публичная' : 'Приватная'}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`editor/map/${map.id}`)}
                  className="openButton"
                  type="button"
                >
                  <Eye size={16} /> Открыть
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    
  );
}

export default MindMapList;
