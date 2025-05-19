import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge
} from 'reactflow';
import { Plus, Edit, Download, X, Trash2, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';
import '../module/MindMapEditor.css';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://localhost:7204/api';

const MapEditor = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const { user = {} } = useAuth();
      const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: null,
    element: null
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const flowWrapperRef = useRef(null);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const [nodesRes, connectionsRes] = await Promise.all([
          axios.get(`${API_URL}/MindMap/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/Connection/map/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const formattedNodes = nodesRes.data.nodes.map(node => ({
          id: node.id.toString(),
          position: { x: node.positionX, y: node.positionY },
          data: { 
            label: (
              <div className="node-card" style={{ backgroundColor: node.color }}>
                <h3>{node.title}</h3>
                <p>{node.description}</p>
              </div>
            )
          },
          style: { 
            border: '2px solid #333',
            borderRadius: '8px',
            backgroundColor: node.color
          },
          draggable: true
        }));

        const formattedEdges = connectionsRes.data.map(conn => ({
          id: `e${conn.sourcenodeid}-${conn.targetnodeid}-${conn.id}`,
          source: conn.sourcenodeid.toString(),
          target: conn.targetnodeid.toString(),
          markerEnd: { type: MarkerType.ArrowClosed }
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      } catch (err) {
        setError('Ошибка загрузки данных: ' + (err.response?.data?.message || err.message));
        console.error(err);
      }
    };
    loadData();
  }, [id, token]);

  const handleNodesChange = useCallback(
    changes => onNodesChange(changes),
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    changes => onEdgesChange(changes),
    [onEdgesChange]
  );

  const onNodeDragStop = useCallback(async (_, node) => {
    try {
      await axios.put(
        `${API_URL}/Node/${node.id}/mindmap/${id}`,
        {
          title: node.data.label.props.children[0].props.children,
          description: node.data.label.props.children[1].props.children,
          positionX: node.position.x,
          positionY: node.position.y,
          color: node.style.backgroundColor
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setError('Ошибка сохранения позиции: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  }, [id, token]);

  const onConnect = useCallback(async (connection) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/Connection`,
        {
          SourceNodeId: parseInt(connection.source),
          TargetNodeId: parseInt(connection.target),
          MindMapId: parseInt(id),
          Type: 'default'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newEdge = {
        id: `e${connection.source}-${connection.target}-${data.id}`,
        source: connection.source,
        target: connection.target,
        markerEnd: { type: MarkerType.ArrowClosed }
      };

      setEdges(eds => addEdge(newEdge, eds));
      setError(null);
    } catch (err) {
      setError('Ошибка создания связи: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  }, [id, token]);

  const onEdgesDelete = useCallback(async (edgesToDelete) => {
    let edgesBackup = [...edges];
    try {
      setEdges(eds => eds.filter(e => 
        !edgesToDelete.some(delEdge => delEdge.id === e.id)
      ));

      await Promise.all(
        edgesToDelete.map(async (edge) => {
          const connectionId = edge.id.split('-')[2];
          await axios.delete(`${API_URL}/Connection/${connectionId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        })
      );
    } catch (err) {
      setEdges(edgesBackup);
      setError('Ошибка удаления связи: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  }, [token, edges]);

  const handleCreateNode = async (formData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/Node/${id}`,
        {
          ...formData,
          positionX: window.innerWidth/2 - 100,
          positionY: window.innerHeight/2 - 50
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newNode = {
        id: data.id.toString(),
        position: { x: data.positionX, y: data.positionY },
        data: { 
          label: (
            <div className="node-card" style={{ backgroundColor: data.color }}>
              <h3>{data.title}</h3>
              <p>{data.description}</p>
            </div>
          )
        },
        style: { 
          border: '2px solid #333',
          borderRadius: '8px',
          backgroundColor: data.color
        }
      };

      setNodes(nds => nds.concat(newNode));
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Ошибка создания узла: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleDeleteConfirmation = async () => {
    if (!deleteConfirmation.element) return;

    try {
      if (deleteConfirmation.type === 'node') {
        await axios.delete(`${API_URL}/Node/${deleteConfirmation.element.id}/mindmap/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setNodes(nodes => nodes.filter(n => n.id !== deleteConfirmation.element.id));
        setEdges(edges => edges.filter(e => 
          e.source !== deleteConfirmation.element.id && 
          e.target !== deleteConfirmation.element.id
        ));
      } else {
        const connectionId = deleteConfirmation.element.id.split('-')[2];
        await axios.delete(`${API_URL}/Connection/${connectionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEdges(eds => eds.filter(e => e.id !== deleteConfirmation.element.id));
      }
      setError(null);
    } catch (err) {
      setError(`Ошибка удаления ${deleteConfirmation.type === 'node' ? 'узла' : 'связи'}: ` + 
        (err.response?.data?.message || err.message));
      console.error(err);
    }
    setDeleteConfirmation({ show: false, type: null, element: null });
  };

  const handleExportPNG = useCallback(() => {
    if (flowWrapperRef.current === null) return;

    toPng(flowWrapperRef.current, {
      filter: (node) => {
        if (node.classList?.contains('react-flow__controls')) return false;
        if (node.classList?.contains('sidebar-panel')) return false;
        return true;
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `mindmap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    });
  }, []);

  const handleUpdateNode = async (formData) => {
    try {
      await axios.put(
        `${API_URL}/Node/${selectedNode.id}/mindmap/${id}`,
        {
          ...formData,
          positionX: selectedNode.position.x,
          positionY: selectedNode.position.y
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNodes(nodes => nodes.map(n => 
        n.id === selectedNode.id ? {
          ...n,
          data: { 
            label: (
              <div className="node-card" style={{ backgroundColor: formData.color }}>
                <h3>{formData.title}</h3>
                <p>{formData.description}</p>
              </div>
            )
          },
          style: { ...n.style, backgroundColor: formData.color }
        } : n
      ));
      
      setEditModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Ошибка обновления узла: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="editor-container">
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
      <div className="sidebar-panel">
        <button 
          className="sidebar-btn"
          onClick={() => setShowForm(true)}
          title="Добавить узел"
        >
          <Plus size={24} />
        </button>

        <button 
          className="sidebar-btn"
          onClick={() => setEditModalOpen(true)}
          title="Редактировать узел"
          disabled={!selectedNode}
        >
          <Edit size={24} />
        </button>

        <button 
          className="sidebar-btn"
          onClick={handleExportPNG}
          title="Сохранить как PNG"
        >
          <Download size={24} />
        </button>
      </div>

      <div className="flow-wrapper" ref={flowWrapperRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          onNodeClick={(_, node) => setSelectedNode(node)}
          onNodeDoubleClick={(_, node) => setDeleteConfirmation({
            show: true,
            type: 'node',
            element: node
          })}
          onEdgeClick={(_, edge) => setDeleteConfirmation({
            show: true,
            type: 'edge',
            element: edge
          })}
          fitView
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: '#333' },
            markerEnd: { type: MarkerType.ArrowClosed }
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Подтвердите удаление</h3>
            <p>
              {deleteConfirmation.type === 'node'
                ? "Вы уверены, что хотите удалить этот узел и все связанные связи?"
                : "Вы уверены, что хотите удалить эту связь?"}
            </p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setDeleteConfirmation({ show: false, type: null, element: null })}
              >
                <X size={18} /> Отмена
              </button>
              <button className="confirm-btn" onClick={handleDeleteConfirmation}>
                <Trash2 size={18} /> Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <NodeCreationForm
          onSubmit={handleCreateNode}
          onClose={() => setShowForm(false)}
        />
      )}

      {editModalOpen && selectedNode && (
        <NodeForm
          title="Редактировать узел"
          initialData={{
            title: selectedNode.data.label.props.children[0].props.children,
            description: selectedNode.data.label.props.children[1].props.children,
            color: selectedNode.style.backgroundColor
          }}
          onSubmit={handleUpdateNode}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

const NodeCreationForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#ffffff'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <div className="node-form">
        <h2>Создать новый узел</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Название:
            <input
              type="text"
              className="input-form"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </label>

          <label>
            Описание:
            <textarea
              className="input-form"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </label>

          <label>
            Цвет фона:
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
            />
          </label>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Создать</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NodeForm = ({ title, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название узла');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <div className="node-form">
        <div className="form-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Название:
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              autoFocus
            />
          </label>

          <label>
            Описание:
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Необязательное поле"
            />
          </label>

          <label>
            Цвет фона:
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
            />
          </label>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="confirm-btn">
              <Check size={18} /> Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapEditor;