import React, { useState, useEffect, useCallback } from 'react';
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
import 'reactflow/dist/style.css';
import '../module/MindMapEditor.css';

const API_URL = 'https://localhost:7204/api';

const MapEditor = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка начальных данных
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загрузка узлов
        const nodesRes = await axios.get(`${API_URL}/MindMap/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Загрузка соединений
        const connectionsRes = await axios.get(`${API_URL}/Connection/map/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Форматирование узлов
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
          }
        }));

        // Форматирование соединений
        const formattedEdges = connectionsRes.data.map(conn => ({
          id: `e${conn.sourcenodeid}-${conn.targetnodeid}-${conn.id}`,
          source: conn.sourcenodeid.toString(),
          target: conn.targetnodeid.toString(),
          markerEnd: { type: MarkerType.ArrowClosed }
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      } catch (err) {
        setError('Ошибка загрузки данных');
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
  // Обработчик перемещения узлов
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
      setError('Ошибка сохранения позиции');
      console.error(err);
    }
  }, [id, token]);

  // Создание соединений
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
      setError('Ошибка создания связи');
      console.error(err);
    }
  }, [id, token]);

  // Удаление соединений
  const onEdgesDelete = useCallback(async (edges) => {
    for (const edge of edges) {
      try {
        const connectionId = edge.id.split('-')[2];
        await axios.delete(`${API_URL}/Connection/${connectionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEdges(eds => eds.filter(e => e.id !== edge.id));
        setError(null);
      } catch (err) {
        setError('Ошибка удаления связи');
        console.error(err);
      }
    }
  }, [token]);

  // Создание узлов
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
      setError('Ошибка создания узла');
      console.error(err);
    }
  };

  return (
    <div className="editor-container">
      <ReactFlow
         nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange} // Используем обработчик
        onEdgesChange={handleEdgesChange} // Используем обработчик
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        fitView
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: '#333' },
          markerEnd: { type: MarkerType.ArrowClosed }
        }}
        
      >
        <Background />
        <Controls />

        <div className="toolbar">
          <button 
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            Добавить узел
          </button>
        </div>
      </ReactFlow>

      {showForm && (
        <NodeCreationForm
          onSubmit={handleCreateNode}
          onClose={() => setShowForm(false)}
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
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </label>

          <label>
            Описание:
            <textarea
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

export default MapEditor;