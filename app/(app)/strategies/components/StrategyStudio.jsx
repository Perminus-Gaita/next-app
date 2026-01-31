"use client";
import React, { useState, useRef } from 'react';
import { Plus, Play, Trash2, Save } from 'lucide-react';

const DUMMY_MATCHES = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  homeOdds: 1.2 + Math.random() * 2,
  homeWinsLast5: Math.floor(Math.random() * 6),
}));

export default function StrategyStudio() {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'START', x: 300, y: 50, label: 'All Matches' },
  ]);
  
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [results, setResults] = useState({ '1': { count: 17 } });
  const [hasRun, setHasRun] = useState(false);
  
  const canvasRef = useRef(null);

  const addNode = (type) => {
    const newNode = {
      id: Date.now().toString(),
      type,
      x: 300,
      y: 50 + nodes.length * 120,
      field: type === 'CONDITION' ? 'homeOdds' : undefined,
      operator: type === 'CONDITION' ? '<' : undefined,
      value: type === 'CONDITION' ? 1.5 : undefined,
      action: type === 'ACTION' ? 'pick_home' : undefined,
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id) => {
    if (id === '1') return;
    setNodes(nodes.filter(n => n.id !== id));
  };

  const updateNode = (id, updates) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    
    setDragging(nodeId);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;
    
    updateNode(dragging, { x, y });
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const runWorkflow = () => {
    let currentMatches = DUMMY_MATCHES;
    const newResults = {};

    const sortedNodes = [...nodes].sort((a, b) => a.y - b.y);

    sortedNodes.forEach(node => {
      if (node.type === 'START') {
        newResults[node.id] = { count: currentMatches.length };
      } 
      else if (node.type === 'CONDITION') {
        currentMatches = currentMatches.filter(match => {
          const value = match[node.field];
          switch (node.operator) {
            case '<': return value < node.value;
            case '<=': return value <= node.value;
            case '>': return value > node.value;
            case '>=': return value >= node.value;
            default: return true;
          }
        });
        newResults[node.id] = { count: currentMatches.length };
      }
      else if (node.type === 'ACTION') {
        newResults[node.id] = { 
          count: currentMatches.length,
          action: node.action 
        };
      }
    });

    setResults(newResults);
    setHasRun(true);
  };

  const saveStrategy = () => {
    console.log('Saving strategy:', nodes);
    alert('Strategy saved! (Database integration pending)');
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'START': return 'bg-purple-100 dark:bg-purple-900/30 border-purple-400';
      case 'CONDITION': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-400';
      case 'ACTION': return 'bg-green-100 dark:bg-green-900/30 border-green-400';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Build Your Strategy</h2>
            <p className="text-sm text-muted-foreground">
              Drag nodes to reposition. Workflow executes top-to-bottom.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addNode('CONDITION')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Condition
            </button>
            <button
              onClick={() => addNode('ACTION')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Action
            </button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-border"
          style={{ height: '500px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.slice(0, -1).map((node, i) => {
              const nextNode = nodes[i + 1];
              if (!nextNode) return null;

              return (
                <line
                  key={node.id}
                  x1={node.x + 90}
                  y1={node.y + 60}
                  x2={nextNode.x + 90}
                  y2={nextNode.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
              );
            })}
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
            </defs>
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute ${getNodeColor(node.type)} border-2 rounded-lg p-3 shadow-lg transition-shadow hover:shadow-xl cursor-move`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '180px',
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {node.type}
                </span>
                {node.type !== 'START' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {node.type === 'CONDITION' && (
                <div className="space-y-1">
                  <select
                    value={node.field}
                    onChange={(e) => updateNode(node.id, { field: e.target.value })}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-900"
                  >
                    <option value="homeOdds">Home Odds</option>
                    <option value="homeWinsLast5">Home Wins (Last 5)</option>
                  </select>

                  <div className="flex gap-1">
                    <select
                      value={node.operator}
                      onChange={(e) => updateNode(node.id, { operator: e.target.value })}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="w-12 px-1 py-1 text-xs border rounded bg-white dark:bg-gray-900"
                    >
                      <option value="<">&lt;</option>
                      <option value="<=">&le;</option>
                      <option value=">">&gt;</option>
                      <option value=">=">&ge;</option>
                    </select>

                    <input
                      type="number"
                      step="0.1"
                      value={node.value}
                      onChange={(e) => updateNode(node.id, { value: parseFloat(e.target.value) })}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="flex-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
              )}

              {node.type === 'ACTION' && (
                <select
                  value={node.action}
                  onChange={(e) => updateNode(node.id, { action: e.target.value })}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-900"
                >
                  <option value="pick_home">🏠 Home</option>
                  <option value="pick_draw">🤝 Draw</option>
                  <option value="pick_away">✈️ Away</option>
                </select>
              )}

              <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                <div className="text-xs font-bold text-gray-900 dark:text-white">
                  {results[node.id]?.count || 0} matches
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <button
            onClick={runWorkflow}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Run Strategy
          </button>

          <button
            onClick={saveStrategy}
            disabled={!hasRun}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            Save Strategy
          </button>
        </div>
      </div>

      {hasRun && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3">Test Results</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Total matches processed:</span> 17
            </p>
            <p className="text-sm">
              <span className="font-medium">Matches meeting criteria:</span>{' '}
              {results[nodes[nodes.length - 1]?.id]?.count || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              💡 Click "Save Strategy" to add this to your collection
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
