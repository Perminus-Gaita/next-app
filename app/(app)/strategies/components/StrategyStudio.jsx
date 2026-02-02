'use client';

import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Save, Plus, Trash2 } from 'lucide-react';

// ============================================
// DUMMY MATCH DATA
// ============================================
const DUMMY_MATCHES = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  homeTeam: `Team ${i + 1}A`,
  awayTeam: `Team ${i + 1}B`,
  homeOdds: parseFloat((Math.random() * 2 + 1.2).toFixed(2)),
  drawOdds: parseFloat((Math.random() * 1.5 + 2.8).toFixed(2)),
  awayOdds: parseFloat((Math.random() * 3 + 2.5).toFixed(2)),
  homeForm: Math.floor(Math.random() * 6),
  awayForm: Math.floor(Math.random() * 6),
  isDerby: Math.random() > 0.8,
}));

// ============================================
// CUSTOM NODE: START
// ============================================
const StartNode = ({ data }) => {
  return (
    <div className="px-6 py-4 shadow-lg rounded-lg bg-slate-800 border-2 border-slate-600">
      <div className="text-white text-center">
        <div className="text-sm font-semibold text-slate-300 mb-1">START</div>
        <div className="text-2xl font-bold">17 Matches</div>
        {data.results && (
          <div className="text-xs text-slate-400 mt-2">
            {data.results.total} evaluated
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CUSTOM NODE: BRANCH HEAD
// ============================================
const BranchNode = ({ data, id }) => {
  const colors = {
    HOME: { bg: 'bg-emerald-800', border: 'border-emerald-600', text: 'text-emerald-100' },
    DRAW: { bg: 'bg-blue-800', border: 'border-blue-600', text: 'text-blue-100' },
    AWAY: { bg: 'bg-purple-800', border: 'border-purple-600', text: 'text-purple-100' },
  };

  const color = colors[data.armType] || colors.HOME;

  return (
    <div className={`px-5 py-4 shadow-lg rounded-lg ${color.bg} border-2 ${color.border} min-w-[220px]`}>
      <div className={color.text}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold">
            {data.armType === 'HOME' && '🏠 HOME ARM'}
            {data.armType === 'DRAW' && '🤝 DRAW ARM'}
            {data.armType === 'AWAY' && '✈️ AWAY ARM'}
          </div>
        </div>

        <select
          value={data.logicType}
          onChange={(e) => data.onLogicChange(id, e.target.value)}
          className="w-full px-2 py-1.5 text-sm rounded bg-slate-900 text-white border border-slate-600 mb-2"
        >
          <option value="AND">AND (All must pass)</option>
          <option value="OR">OR (Any can pass)</option>
          <option value="WEIGHTED">WEIGHTED (Score sum)</option>
        </select>

        <button
          onClick={() => data.onAddCondition(id)}
          className="w-full py-2 bg-slate-900 hover:bg-slate-700 rounded text-sm font-medium transition-all border border-slate-600"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Add Condition
        </button>

        {data.results && (
          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="text-sm font-semibold">
              {data.results.count} picks
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CUSTOM NODE: CONDITION
// ============================================
const ConditionNode = ({ data, id }) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-slate-700 border border-slate-500 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-slate-300">CONDITION</div>
        <button
          onClick={() => data.onDelete(id)}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        <select
          value={data.field}
          onChange={(e) => data.onUpdate(id, { field: e.target.value })}
          className="w-full px-2 py-1 text-xs rounded bg-slate-800 text-white border border-slate-600"
        >
          <option value="homeOdds">Home Odds</option>
          <option value="drawOdds">Draw Odds</option>
          <option value="awayOdds">Away Odds</option>
          <option value="homeForm">Home Form</option>
          <option value="awayForm">Away Form</option>
          <option value="isDerby">Derby Match</option>
        </select>

        <div className="flex gap-1">
          <select
            value={data.operator}
            onChange={(e) => data.onUpdate(id, { operator: e.target.value })}
            className="w-12 px-1 py-1 text-xs rounded bg-slate-800 text-white border border-slate-600"
          >
            <option value="<">&lt;</option>
            <option value="<=">&le;</option>
            <option value=">">&gt;</option>
            <option value=">=">&ge;</option>
            <option value="==">==</option>
          </select>

          <input
            type="number"
            step="0.1"
            value={data.value}
            onChange={(e) => data.onUpdate(id, { value: parseFloat(e.target.value) })}
            className="flex-1 px-2 py-1 text-xs rounded bg-slate-800 text-white border border-slate-600"
          />
        </div>

        {data.showWeight && (
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-xs">Weight:</span>
            <input
              type="number"
              value={data.weight}
              onChange={(e) => data.onUpdate(id, { weight: parseInt(e.target.value) })}
              className="w-14 px-2 py-1 text-xs rounded bg-slate-800 text-white border border-slate-600"
            />
            <span className="text-xs">%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// NODE TYPES
// ============================================
const nodeTypes = {
  startNode: StartNode,
  branchNode: BranchNode,
  conditionNode: ConditionNode,
};

// ============================================
// INITIAL NODES & EDGES
// ============================================
const initialNodes = [
  {
    id: '1',
    type: 'startNode',
    position: { x: 400, y: 50 },
    data: { label: 'START' },
  },
  {
    id: '2',
    type: 'branchNode',
    position: { x: 100, y: 200 },
    data: {
      armType: 'HOME',
      logicType: 'AND',
      onLogicChange: () => {},
      onAddCondition: () => {},
    },
  },
  {
    id: '3',
    type: 'branchNode',
    position: { x: 400, y: 200 },
    data: {
      armType: 'DRAW',
      logicType: 'OR',
      onLogicChange: () => {},
      onAddCondition: () => {},
    },
  },
  {
    id: '4',
    type: 'branchNode',
    position: { x: 700, y: 200 },
    data: {
      armType: 'AWAY',
      logicType: 'WEIGHTED',
      onLogicChange: () => {},
      onAddCondition: () => {},
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function StrategyStudio() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [results, setResults] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#64748b' } }, eds)),
    [setEdges]
  );

  const handleLogicChange = (nodeId, logicType) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              logicType,
            },
          };
        }
        return node;
      })
    );
  };

  const handleAddCondition = (branchId) => {
    const branchNode = nodes.find((n) => n.id === branchId);
    const conditionsUnderBranch = nodes.filter(
      (n) => n.type === 'conditionNode' && n.data.parentBranch === branchId
    );

    const newNodeId = `condition-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'conditionNode',
      position: {
        x: branchNode.position.x,
        y: branchNode.position.y + 120 + conditionsUnderBranch.length * 100,
      },
      data: {
        parentBranch: branchId,
        field: 'homeOdds',
        operator: '<',
        value: 1.5,
        weight: 40,
        showWeight: branchNode.data.logicType === 'WEIGHTED',
        onUpdate: handleUpdateCondition,
        onDelete: handleDeleteCondition,
      },
    };

    const newEdge = {
      id: `e${branchId}-${newNodeId}`,
      source: conditionsUnderBranch.length === 0 ? branchId : conditionsUnderBranch[conditionsUnderBranch.length - 1].id,
      target: newNodeId,
      animated: false,
      style: { stroke: '#64748b', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  const handleUpdateCondition = (nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  };

  const handleDeleteCondition = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  // Update node data with callbacks
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'branchNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onLogicChange: handleLogicChange,
              onAddCondition: handleAddCondition,
            },
          };
        }
        if (node.type === 'conditionNode') {
          const parentBranch = nds.find((n) => n.id === node.data.parentBranch);
          return {
            ...node,
            data: {
              ...node.data,
              showWeight: parentBranch?.data?.logicType === 'WEIGHTED',
              onUpdate: handleUpdateCondition,
              onDelete: handleDeleteCondition,
            },
          };
        }
        return node;
      })
    );
  }, []);

  const evaluateCondition = (match, condition) => {
    const value = match[condition.field];
    switch (condition.operator) {
      case '<': return value < condition.value;
      case '<=': return value <= condition.value;
      case '>': return value > condition.value;
      case '>=': return value >= condition.value;
      case '==': return value === condition.value;
      default: return false;
    }
  };

  const runStrategy = () => {
    const branchNodes = nodes.filter((n) => n.type === 'branchNode');
    const conditionNodes = nodes.filter((n) => n.type === 'conditionNode');

    const predictions = DUMMY_MATCHES.map((match) => {
      const armResults = branchNodes.map((branch) => {
        const branchConditions = conditionNodes.filter((c) => c.data.parentBranch === branch.id);

        if (branchConditions.length === 0) {
          return { arm: branch.data.armType, passed: false, confidence: 0 };
        }

        let passed = false;
        let confidence = 0;

        if (branch.data.logicType === 'AND') {
          passed = branchConditions.every((c) => evaluateCondition(match, c.data));
          confidence = passed ? 100 : 0;
        } else if (branch.data.logicType === 'OR') {
          passed = branchConditions.some((c) => evaluateCondition(match, c.data));
          confidence = passed ? 100 : 0;
        } else if (branch.data.logicType === 'WEIGHTED') {
          confidence = branchConditions.reduce((sum, c) => {
            return sum + (evaluateCondition(match, c.data) ? c.data.weight : 0);
          }, 0);
          passed = confidence >= 70;
        }

        return { arm: branch.data.armType, passed, confidence };
      });

      const passedArms = armResults.filter((r) => r.passed);

      if (passedArms.length === 0) {
        return { match, prediction: 'SKIP', reason: 'No arm passed' };
      } else if (passedArms.length === 1) {
        return { match, prediction: passedArms[0].arm, reason: `${passedArms[0].arm} arm passed` };
      } else {
        const winner = passedArms.reduce((a, b) => (a.confidence > b.confidence ? a : b));
        return { match, prediction: winner.arm, reason: `Highest confidence: ${winner.arm}` };
      }
    });

    const summary = {
      total: predictions.length,
      home: predictions.filter((p) => p.prediction === 'HOME').length,
      draw: predictions.filter((p) => p.prediction === 'DRAW').length,
      away: predictions.filter((p) => p.prediction === 'AWAY').length,
      skip: predictions.filter((p) => p.prediction === 'SKIP').length,
    };

    setResults({ predictions, summary });
    setHasRun(true);

    // Update nodes with results
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'startNode') {
          return { ...node, data: { ...node.data, results: summary } };
        }
        if (node.type === 'branchNode') {
          const count = summary[node.data.armType.toLowerCase()];
          return { ...node, data: { ...node.data, results: { count } } };
        }
        return node;
      })
    );
  };

  const saveStrategy = () => {
    console.log('Saving strategy:', { nodes, edges });
    alert('Strategy saved! (Database integration pending)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-6 text-white border border-slate-700">
        <h2 className="text-2xl font-bold mb-2">Strategy Studio - Visual Workflow</h2>
        <p className="text-sm text-slate-300">
          Build your strategy using the 3-arms system. Each arm evaluates all 17 matches independently.
        </p>
      </div>

      {/* React Flow Canvas */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ height: '600px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-900"
        >
          <Controls className="bg-slate-800 border border-slate-700" />
          <MiniMap className="bg-slate-800 border border-slate-700" nodeColor="#475569" />
          <Background color="#475569" gap={16} />
        </ReactFlow>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl p-6">
        <button
          onClick={runStrategy}
          className="flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          <Play className="w-5 h-5" />
          Test Strategy
        </button>

        <button
          onClick={saveStrategy}
          disabled={!hasRun}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          Save Strategy
        </button>
      </div>

      {/* Results Panel */}
      {hasRun && results && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Test Results</h3>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-100 dark:bg-slate-800 rounded p-3 text-center">
              <div className="text-2xl font-bold">{results.summary.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{results.summary.home}</div>
              <div className="text-xs text-muted-foreground">Home</div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.summary.draw}</div>
              <div className="text-xs text-muted-foreground">Draw</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.summary.away}</div>
              <div className="text-xs text-muted-foreground">Away</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded p-3 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{results.summary.skip}</div>
              <div className="text-xs text-muted-foreground">Skip</div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.predictions.map((pred, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    #{pred.match.id} {pred.match.homeTeam} vs {pred.match.awayTeam}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pred.match.homeOdds} / {pred.match.drawOdds} / {pred.match.awayOdds}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-bold ${
                      pred.prediction === 'HOME'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : pred.prediction === 'DRAW'
                        ? 'text-blue-600 dark:text-blue-400'
                        : pred.prediction === 'AWAY'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`}
                  >
                    {pred.prediction === 'HOME' && '🏠 HOME'}
                    {pred.prediction === 'DRAW' && '🤝 DRAW'}
                    {pred.prediction === 'AWAY' && '✈️ AWAY'}
                    {pred.prediction === 'SKIP' && '⏭️ SKIP'}
                  </div>
                  <div className="text-xs text-muted-foreground">{pred.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
