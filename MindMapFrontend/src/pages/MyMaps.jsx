import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Check, X, Eye } from 'lucide-react';
import "../module/MindMapList.css";

function MindMapList() {
  const navigate = useNavigate();
  const [mindMaps, setMindMaps] = useState([]);
  const [loading, setLoading] = useState(true);

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
        { title: newTitle.trim(), ispublic: false },
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

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Ваши ментальные карты</h1>
        {isCreating ? (
          <div className="create-form">
            <input
              type="text"
              className="create-input"
              placeholder="Название карты"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button onClick={handleSaveNew} className="btn-save" type="button">
              <Check size={16} /> Сохранить
            </button>
            <button onClick={handleCancel} className="btn-cancel" type="button">
              <X size={16} />
            </button>
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
  );
}

export default MindMapList;
