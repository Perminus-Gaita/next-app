'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Plus, X, Home, Minus, Plane, Target, Scale, Settings,
  Play, Save, ArrowLeft,
  BarChart4, TrendingUp, AlertTriangle, Crosshair, History, Sparkles,
} from 'lucide-react';

// ═══════════════════════════════════════════
// CATEGORIES (from h2h page + AI)
// ═══════════════════════════════════════════
const CATEGORIES = [
  {
    id: 'quality',
    name: 'Quality & Efficiency',
    icon: BarChart4,
    color: '#3b82f6',
    metrics: [
      { id: 'rank', name: 'League Rank', category: 'Quality & Efficiency', color: '#3b82f6' },
      { id: 'xg', name: 'Expected Goals (xG)', category: 'Quality & Efficiency', color: '#3b82f6' },
      { id: 'xga', name: 'Expected Goals Against (xGA)', category: 'Quality & Efficiency', color: '#3b82f6' },
      { id: 'conv', name: 'Conversion Rate', category: 'Quality & Efficiency', color: '#3b82f6' },
      { id: 'finishing', name: 'Finishing Efficiency Index', category: 'Quality & Efficiency', color: '#3b82f6' },
      { id: 'sustainability', name: 'Performance Sustainability Index', category: 'Quality & Efficiency', color: '#3b82f6' },
      { id: 'poss', name: 'Possession %', category: 'Quality & Efficiency', color: '#3b82f6' },
      { id: 'sot', name: 'Shots on Target', category: 'Quality & Efficiency', color: '#3b82f6' },
    ],
  },
  {
    id: 'form',
    name: 'Momentum & Form',
    icon: TrendingUp,
    color: '#f59e0b',
    metrics: [
      { id: 'form', name: 'Last 5 Results', category: 'Momentum & Form', color: '#f59e0b' },
      { id: 'momentum', name: 'Form Momentum Score', category: 'Momentum & Form', color: '#f59e0b' },
      { id: 'winpct', name: 'Win %', category: 'Momentum & Form', color: '#f59e0b' },
      { id: 'gf', name: 'Goals Scored (L5)', category: 'Momentum & Form', color: '#f59e0b' },
      { id: 'ga', name: 'Goals Conceded (L5)', category: 'Momentum & Form', color: '#f59e0b' },
      { id: 'unb', name: 'Unbeaten Run', category: 'Momentum & Form', color: '#f59e0b' },
    ],
  },
  {
    id: 'health',
    name: 'Squad Health',
    icon: AlertTriangle,
    color: '#ef4444',
    metrics: [
      { id: 'abs', name: 'Absences', category: 'Squad Health', color: '#ef4444' },
      { id: 'rest', name: 'Days Rest', category: 'Squad Health', color: '#ef4444' },
      { id: 'travel', name: 'Travel Distance', category: 'Squad Health', color: '#ef4444' },
    ],
  },
  {
    id: 'tactical',
    name: 'Tactical',
    icon: Crosshair,
    color: '#8b5cf6',
    metrics: [
      { id: 'setpiece', name: 'Set Piece xG', category: 'Tactical', color: '#8b5cf6' },
      { id: 'defensive', name: 'Defensive Activity Score', category: 'Tactical', color: '#8b5cf6' },
      { id: 'clean', name: 'Clean Sheet %', category: 'Tactical', color: '#8b5cf6' },
      { id: 'disc', name: 'Discipline (YC/game)', category: 'Tactical', color: '#8b5cf6' },
      { id: 'homewin', name: 'Home Win% / Away Win%', category: 'Tactical', color: '#8b5cf6' },
      { id: 'homedraw', name: 'Home Draw% / Away Draw%', category: 'Tactical', color: '#8b5cf6' },
    ],
  },
  {
    id: 'h2h',
    name: 'H2H',
    icon: History,
    color: '#14b8a6',
    metrics: [
      { id: 'h2h', name: 'Head-to-Head Record', category: 'H2H', color: '#14b8a6' },
      { id: 'h2hform', name: 'Recent H2H Form', category: 'H2H', color: '#14b8a6' },
    ],
  },
  {
    id: 'ai',
    name: 'AI Insights',
    icon: Sparkles,
    color: '#ec4899',
    metrics: [
      { id: 'ai_pred', name: 'AI Match Prediction', category: 'AI Insights', color: '#ec4899' },
      { id: 'ai_value', name: 'AI Value Analysis', category: 'AI Insights', color: '#ec4899' },
      { id: 'ai_pattern', name: 'AI Pattern Recognition', category: 'AI Insights', color: '#ec4899' },
    ],
  },
];

function findCategoryForMetric(metricId) {
  for (const cat of CATEGORIES) {
    if (cat.metrics.find((m) => m.id === metricId)) return cat;
  }
  return null;
}

// ═══════════════════════════════════════════
// BRANCHES
// ═══════════════════════════════════════════
const BRANCHES_LIST = ['home', 'draw', 'away'];
const BRANCH_META = {
  home: { label: 'Home', color: '#10b981', emoji: '🏠' },
  draw: { label: 'Draw', color: '#64748b', emoji: '🤝' },
  away: { label: 'Away', color: '#f59e0b', emoji: '✈️' },
};

const branches = [
  { id: 'home', name: 'HOME WIN', color: '#10b981', icon: Home },
  { id: 'draw', name: 'DRAW', color: '#94a3b8', icon: Minus },
  { id: 'away', name: 'AWAY WIN', color: '#f59e0b', icon: Plane }
];

// ═══════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════
const START_X = 300;
const START_Y = 30;
const FIRST_STEP_Y = 160;
const STEP_GAP = 120;
const BRANCH_SPACING = 280;
function bx(i) { return START_X + (i - 1) * BRANCH_SPACING; }

// ═══════════════════════════════════════════
// DARK MODE
// ═══════════════════════════════════════════
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ═══════════════════════════════════════════
// THEME CSS
// ═══════════════════════════════════════════
const THEME_CSS = `
  .react-flow__node-startNode,
  .react-flow__node-stepNode {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    cursor: pointer;
    color: #1e293b;
  }
  .react-flow__node-stepNode {
    overflow: visible !important;
  }
  .react-flow__node.selected {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 2.5px rgba(59,130,246,0.18);
  }
  .react-flow__handle {
    opacity: 0 !important;
    width: 6px !important;
    height: 6px !important;
    pointer-events: none !important;
  }
  .dark .react-flow__node-startNode,
  .dark .react-flow__node-stepNode {
    background: #1e293b;
    border-color: rgba(148,163,184,0.2);
    color: #e2e8f0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .dark .react-flow__controls button {
    background: #1e293b;
    border-color: #334155;
    fill: #94a3b8;
  }
  .dark .react-flow__controls button:hover {
    background: #334155;
  }
  .dark .react-flow__minimap {
    background: rgba(15,23,42,0.8) !important;
  }
  .rf-add-btn {
    background: #f1f5f9;
    color: #64748b;
    border: 1.5px dashed #cbd5e1;
    transition: all 0.15s;
  }
  .rf-add-btn:hover {
    background: #dbeafe;
    color: #3b82f6;
    border-color: #93c5fd;
  }
  .dark .rf-add-btn {
    background: rgba(30,41,59,0.9);
    color: #64748b;
    border-color: #334155;
  }
  .dark .rf-add-btn:hover {
    background: rgba(59,130,246,0.15);
    color: #60a5fa;
    border-color: rgba(59,130,246,0.3);
  }
`;

// ═══════════════════════════════════════════
// START NODE
// ═══════════════════════════════════════════
function StartNode() {
  return (
    <>
      <span>Start</span>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

// ═══════════════════════════════════════════
// STEP NODE
// ═══════════════════════════════════════════
function StepNode({ data }) {
  const hasMetric = !!data.metric;
  const cat = hasMetric ? findCategoryForMetric(data.metric.id) : null;
  const CatIcon = cat?.icon;
  const isLast = data.isLastStep;

  return (
    <div style={{ position: 'relative' }}>
      <Handle type="target" position={Position.Top} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
        {hasMetric && CatIcon ? (
          <>
            <CatIcon size={13} style={{ color: cat.color, flexShrink: 0 }} />
            <span>{data.metric.name}</span>
          </>
        ) : (
          <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Select metric</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
      {isLast && (
        <button
          className="nopan nodrag rf-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (data.onAddAfter) data.onAddAfter(data.stepIndex);
          }}
          style={{
            position: 'absolute',
            bottom: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            zIndex: 10,
            lineHeight: 1,
            padding: 0,
          }}
        >
          +
        </button>
      )}
    </div>
  );
}

const nodeTypes = { startNode: StartNode, stepNode: StepNode };

// ═══════════════════════════════════════════
// STUDIO INNER (ReactFlow canvas + state)
// ═══════════════════════════════════════════
function StudioInner() {
  const { fitView } = useReactFlow();
  const isDark = useDarkMode();

  const [maxPercentage, setMaxPercentage] = useState(50);

  const [steps, setSteps] = useState([
    {
      id: 1,
      metric: null,
      homeMin: -50, homeMax: -15, homeMinIsArrow: true,
      drawMin: -10, drawMax: 10,
      awayMin: 15, awayMax: 50, awayMaxIsArrow: true,
    }
  ]);

  const [branchConfigs, setBranchConfigs] = useState({
    home: { 1: { edgeType: 'match', weight: 5 } },
    draw: { 1: { edgeType: 'match', weight: 5 } },
    away: { 1: { edgeType: 'match', weight: 5 } }
  });

  const [showMetricModal, setShowMetricModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [configTarget, setConfigTarget] = useState(null);

  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  // ─── Step actions ───
  const addStep = useCallback(() => {
    const newId = stepsRef.current.length > 0
      ? Math.max(...stepsRef.current.map(s => s.id)) + 1
      : 1;
    setSteps(prev => [...prev, {
      id: newId,
      metric: null,
      homeMin: -maxPercentage, homeMax: -15, homeMinIsArrow: true,
      drawMin: -10, drawMax: 10,
      awayMin: 15, awayMax: maxPercentage, awayMaxIsArrow: true
    }]);
    setBranchConfigs(prev => ({
      home: { ...prev.home, [newId]: { edgeType: 'match', weight: 5 } },
      draw: { ...prev.draw, [newId]: { edgeType: 'match', weight: 5 } },
      away: { ...prev.away, [newId]: { edgeType: 'match', weight: 5 } }
    }));
  }, [maxPercentage]);

  const addStepAfter = useCallback((index) => {
    addStep();
  }, [addStep]);

  const removeStep = useCallback((stepId) => {
    if (stepsRef.current.length > 1) {
      setSteps(prev => prev.filter(s => s.id !== stepId));
      setBranchConfigs(prev => {
        const nc = {
          home: { ...prev.home },
          draw: { ...prev.draw },
          away: { ...prev.away }
        };
        delete nc.home[stepId];
        delete nc.draw[stepId];
        delete nc.away[stepId];
        return nc;
      });
    }
  }, []);

  const updateStep = useCallback((stepId, updates) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const updateBranchConfig = useCallback((branch, stepId, field, value) => {
    setBranchConfigs(prev => ({
      ...prev,
      [branch]: {
        ...prev[branch],
        [stepId]: {
          ...prev[branch][stepId],
          [field]: value
        }
      }
    }));
  }, []);

  const selectMetric = useCallback((metric) => {
    updateStep(editingStep, { metric });
    setShowMetricModal(false);
    setEditingStep(null);
    if (configTarget) {
      setShowConfigModal(true);
    }
  }, [editingStep, configTarget, updateStep]);

  const openStepConfig = useCallback((stepId, branch) => {
    setConfigTarget({ stepId, branch });
    setShowConfigModal(true);
  }, []);

  // ─── Build nodes & edges ───
  const { builtNodes, builtEdges } = useMemo(() => {
    const ns = [];
    const es = [];

    ns.push({
      id: 'start',
      type: 'startNode',
      position: { x: START_X, y: START_Y },
      data: {},
      draggable: true,
    });

    BRANCHES_LIST.forEach((branch, bi) => {
      const x = bx(bi);
      const meta = BRANCH_META[branch];

      steps.forEach((step, si) => {
        const nodeId = 'node-' + step.id + '-' + branch;
        const isLastStep = si === steps.length - 1;

        ns.push({
          id: nodeId,
          type: 'stepNode',
          position: { x, y: FIRST_STEP_Y + si * STEP_GAP },
          data: {
            branch,
            stepId: step.id,
            stepIndex: si,
            metric: step.metric,
            isLastStep,
            onAddAfter: addStepAfter,
          },
          draggable: true,
        });

        if (si === 0) {
          es.push({
            id: 'e-start-' + branch,
            source: 'start',
            target: nodeId,
            type: 'default',
            label: meta.emoji + ' ' + meta.label,
            labelStyle: { fontSize: 11, fontWeight: 700, fill: meta.color },
            labelBgStyle: {
              fill: isDark ? '#0f172a' : '#ffffff',
              fillOpacity: 0.95,
            },
            labelBgPadding: [6, 8],
            labelBgBorderRadius: 6,
            style: { stroke: meta.color, strokeWidth: 2 },
          });
        } else {
          const prevId = 'node-' + steps[si - 1].id + '-' + branch;
          const cfg = branchConfigs[branch]?.[step.id] || { edgeType: 'match', weight: 5 };
          const isMatch = cfg.edgeType === 'match';
          const indicator = isMatch ? '🎯 match' : '⚖️ wt: ' + cfg.weight;

          es.push({
            id: 'e-' + prevId + '-' + nodeId,
            source: prevId,
            target: nodeId,
            type: 'default',
            label: indicator,
            labelStyle: {
              fontSize: 10,
              fontWeight: 600,
              fill: isDark ? '#cbd5e1' : '#475569',
              cursor: 'pointer',
            },
            labelBgStyle: {
              fill: isDark
                ? isMatch ? 'rgba(30,58,138,0.6)' : 'rgba(76,29,149,0.5)'
                : isMatch ? 'rgba(219,234,254,0.95)' : 'rgba(237,233,254,0.95)',
              fillOpacity: 1,
            },
            labelBgPadding: [4, 7],
            labelBgBorderRadius: 6,
            style: { stroke: meta.color, strokeWidth: 1.5 },
            data: { stepId: step.id, branch },
          });
        }
      });
    });

    return { builtNodes: ns, builtEdges: es };
  }, [steps, branchConfigs, isDark, addStepAfter]);

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges);

  useEffect(() => {
    setNodes(builtNodes);
    setEdges(builtEdges);
    setTimeout(() => fitView({ padding: 0.2, duration: 200 }), 50);
  }, [builtNodes, builtEdges, setNodes, setEdges, fitView]);

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.2, duration: 0 }), 200);
  }, [fitView]);

  // ─── Click handlers ───
  const onNodeClick = useCallback((_, node) => {
    if (node.type !== 'stepNode') return;
    const step = stepsRef.current.find((s) => s.id === node.data.stepId);
    if (!step) return;
    if (!step.metric) {
      setEditingStep(node.data.stepId);
      setConfigTarget({ stepId: node.data.stepId, branch: node.data.branch });
      setShowMetricModal(true);
    } else {
      openStepConfig(node.data.stepId, node.data.branch);
    }
  }, [openStepConfig]);

  const onEdgeClick = useCallback((_, edge) => {
    if (edge.data?.stepId) {
      openStepConfig(edge.data.stepId, edge.data.branch);
    }
  }, [openStepConfig]);

  return (
    <div className="w-full space-y-3">
      <style>{THEME_CSS}</style>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700/50">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Strategy Studio
        </span>
        <div className="flex items-center gap-1.5">
          <MaxPercentageControl value={maxPercentage} onChange={setMaxPercentage} />
          <button
            onClick={addStep}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Plus size={12} /> Step
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors">
            <Play size={11} /> Run
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-colors">
            <Save size={11} /> Save
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-950"
        style={{ height: 550, position: 'relative' }}
      >
        <div
          className="text-gray-300/60 dark:text-slate-600/80"
          style={{
            position: 'absolute', top: 14, right: 20, zIndex: 10,
            pointerEvents: 'none', fontWeight: 700, textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 14 }}>Jackpot #12345</div>
          <div style={{ fontSize: 12, marginTop: 2 }}>17 matches</div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          panOnDrag
          zoomOnScroll
          minZoom={0.3}
          maxZoom={2.5}
        >
          <Background color={isDark ? 'rgba(148,163,184,0.04)' : '#e2e8f0'} gap={20} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'startNode') return '#6366f1';
              return BRANCH_META[n.data?.branch]?.color || '#64748b';
            }}
          />
        </ReactFlow>
      </div>

      {/* ─── Modals ─── */}
      {showMetricModal && (
        <MetricSelectorModal
          categories={CATEGORIES}
          onSelect={selectMetric}
          onClose={() => {
            setShowMetricModal(false);
            setEditingStep(null);
            setConfigTarget(null);
          }}
        />
      )}

      {showConfigModal && configTarget && (
        <StepConfigModal
          step={steps.find(s => s.id === configTarget.stepId)}
          branch={branches.find(b => b.id === configTarget.branch)}
          config={branchConfigs[configTarget.branch][configTarget.stepId]}
          maxPercentage={maxPercentage}
          onUpdateMaxPercentage={setMaxPercentage}
          onUpdateStep={(updates) => updateStep(configTarget.stepId, updates)}
          onUpdateConfig={(field, value) => updateBranchConfig(configTarget.branch, configTarget.stepId, field, value)}
          onClose={() => {
            setShowConfigModal(false);
            setConfigTarget(null);
          }}
          onDelete={() => {
            removeStep(configTarget.stepId);
            setShowConfigModal(false);
            setConfigTarget(null);
          }}
          onAdd={addStep}
          canDelete={steps.length > 1}
        />
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// BELOW: User's modal components — kept as provided
// ═══════════════════════════════════════════════════════════════

const MaxPercentageControl = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(value.toString());
  };

  const handleBlur = () => {
    const newValue = parseInt(editValue);
    if (!isNaN(newValue) && newValue >= 50) {
      onChange(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      marginLeft: 'auto',
      padding: '8px 16px',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '8px'
    }}>
      <label style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Max %:
      </label>
      {isEditing ? (
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          min="50"
          style={{
            width: '60px',
            padding: '4px 8px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid #60a5fa',
            borderRadius: '6px',
            color: '#60a5fa',
            fontSize: '13px',
            fontWeight: 700,
            textAlign: 'center'
          }}
        />
      ) : (
        <div
          onClick={handleClick}
          style={{
            padding: '4px 12px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '6px',
            color: '#60a5fa',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            minWidth: '40px',
            textAlign: 'center'
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
};

const generatePlainEnglish = (step, branchId, config, simplified = false) => {
  const metricName = step.metric.name.toLowerCase();
  let statement = '';
  
  if (branchId === 'home') {
    const homeMin = step.homeMin;
    const homeMax = step.homeMax;
    const isArrow = step.homeMinIsArrow;
    
    if (homeMin < 0 && homeMax > 0) {
      const homeAdv = Math.abs(homeMin);
      const awayAdv = Math.abs(homeMax);
      if (simplified) {
        statement = `IF ${metricName} margin is within home advantage limits...`;
      } else if (config.edgeType === 'match') {
        statement = `IF the ${metricName} margin falls within these limits:\n• Home Team is no more than ${homeAdv}% more than Away Team\n• Away Team is no more than ${awayAdv}% more than Home Team\n→ Proceed\nELSE → Stop`;
      } else {
        statement = `Apply ${config.weight} point${config.weight !== 1 ? 's' : ''} if the ${metricName} margin falls within these limits:\n• Home Team is no more than ${homeAdv}% more than Away Team\n• Away Team is no more than ${awayAdv}% more than Home Team\nELSE → 0 points`;
      }
    } else if (homeMin < 0 && homeMax <= 0) {
      const threshold = Math.abs(homeMax);
      const maxAdv = Math.abs(homeMin);
      if (isArrow) {
        if (simplified) statement = `IF ${metricName} of Home Team is ${threshold}% or more than that of Away Team...`;
        else if (config.edgeType === 'match') statement = `IF ${metricName} of Home Team is ${threshold}% or more than that of Away Team\n→ Proceed\nELSE → Stop`;
        else statement = `IF ${metricName} of Home Team is ${threshold}% or more than that of Away Team\n→ Apply weight: ${config.weight} point${config.weight !== 1 ? 's' : ''}\nELSE → 0 points`;
      } else {
        if (simplified) statement = `IF ${metricName} of Home Team is ${threshold}% to ${maxAdv}% more than that of Away Team...`;
        else if (config.edgeType === 'match') statement = `IF ${metricName} of Home Team is ${threshold}% to ${maxAdv}% more than that of Away Team\n→ Proceed\nELSE → Stop`;
        else statement = `IF ${metricName} of Home Team is ${threshold}% to ${maxAdv}% more than that of Away Team\n→ Apply weight: ${config.weight} point${config.weight !== 1 ? 's' : ''}\nELSE → 0 points`;
      }
    } else {
      const minAdv = Math.abs(homeMin);
      const maxAdv = Math.abs(homeMax);
      if (simplified) statement = `IF ${metricName} of Away Team is ${minAdv}% to ${maxAdv}% more than that of Home Team...`;
      else if (config.edgeType === 'match') statement = `IF ${metricName} of Away Team is ${minAdv}% to ${maxAdv}% more than that of Home Team\n→ Proceed\nELSE → Stop`;
      else statement = `IF ${metricName} of Away Team is ${minAdv}% to ${maxAdv}% more than that of Home Team\n→ Apply weight: ${config.weight} point${config.weight !== 1 ? 's' : ''}\nELSE → 0 points`;
    }
  } else if (branchId === 'away') {
    const awayMin = step.awayMin;
    const awayMax = step.awayMax;
    const isArrow = step.awayMaxIsArrow;
    
    if (awayMin < 0 && awayMax > 0) {
      const homeAdv = Math.abs(awayMin);
      const awayAdv = Math.abs(awayMax);
      if (simplified) statement = `IF ${metricName} margin is within away advantage limits...`;
      else if (config.edgeType === 'match') statement = `IF the ${metricName} margin falls within these limits:\n• Home Team is no more than ${homeAdv}% more than Away Team\n• Away Team is no more than ${awayAdv}% more than Home Team\n→ Proceed\nELSE → Stop`;
      else statement = `Apply ${config.weight} point${config.weight !== 1 ? 's' : ''} if the ${metricName} margin falls within these limits:\n• Home Team is no more than ${homeAdv}% more than Away Team\n• Away Team is no more than ${awayAdv}% more than Home Team\nELSE → 0 points`;
    } else if (awayMin >= 0 && awayMax > 0) {
      const threshold = Math.abs(awayMin);
      const maxAdv = Math.abs(awayMax);
      if (isArrow) {
        if (simplified) statement = `IF ${metricName} of Away Team is ${threshold}% or more than that of Home Team...`;
        else if (config.edgeType === 'match') statement = `IF ${metricName} of Away Team is ${threshold}% or more than that of Home Team\n→ Proceed\nELSE → Stop`;
        else statement = `IF ${metricName} of Away Team is ${threshold}% or more than that of Home Team\n→ Apply weight: ${config.weight} point${config.weight !== 1 ? 's' : ''}\nELSE → 0 points`;
      } else {
        if (simplified) statement = `IF ${metricName} of Away Team is ${threshold}% to ${maxAdv}% more than that of Home Team...`;
        else if (config.edgeType === 'match') statement = `IF ${metricName} of Away Team is ${threshold}% to ${maxAdv}% more than that of Home Team\n→ Proceed\nELSE → Stop`;
        else statement = `IF ${metricName} of Away Team is ${threshold}% to ${maxAdv}% more than that of Home Team\n→ Apply weight: ${config.weight} point${config.weight !== 1 ? 's' : ''}\nELSE → 0 points`;
      }
    } else {
      const minAdv = Math.abs(awayMax);
      const maxAdv = Math.abs(awayMin);
      if (simplified) statement = `IF ${metricName} of Home Team is ${minAdv}% to ${maxAdv}% more than that of Away Team...`;
      else if (config.edgeType === 'match') statement = `IF ${metricName} of Home Team is ${minAdv}% to ${maxAdv}% more than that of Away Team\n→ Proceed\nELSE → Stop`;
      else statement = `IF ${metricName} of Home Team is ${minAdv}% to ${maxAdv}% more than that of Away Team\n→ Apply weight: ${config.weight} point${config.weight !== 1 ? 's' : ''}\nELSE → 0 points`;
    }
  } else if (branchId === 'draw') {
    const homeLimit = Math.abs(step.drawMin);
    const awayLimit = Math.abs(step.drawMax);
    if (simplified) statement = `IF ${metricName} margin is within draw limits...`;
    else if (config.edgeType === 'match') statement = `IF the ${metricName} margin falls within these limits:\n• Home Team is no more than ${homeLimit}% more than Away Team\n• Away Team is no more than ${awayLimit}% more than Home Team\n→ Proceed\nELSE → Stop`;
    else statement = `Apply ${config.weight} point${config.weight !== 1 ? 's' : ''} if the ${metricName} margin falls within these limits:\n• Home Team is no more than ${homeLimit}% more than Away Team\n• Away Team is no more than ${awayLimit}% more than Home Team\nELSE → 0 points`;
  }
  
  return statement;
};

const generatePlainEnglishJSX = (step, branchId, config, simplified = false) => {
  const metricName = step.metric.name.toLowerCase();
  
  if (branchId === 'home') {
    const homeMin = step.homeMin;
    const homeMax = step.homeMax;
    const isArrow = step.homeMinIsArrow;
    
    if (homeMin < 0 && homeMax > 0) {
      const homeAdv = Math.abs(homeMin);
      const awayAdv = Math.abs(homeMax);
      if (simplified) return `IF ${metricName} margin is within home advantage limits...`;
      else if (config.edgeType === 'match') return (<>IF the {metricName} margin falls within these limits:<br/>• Home Team is no more than {homeAdv}% more than Away Team<br/>• Away Team is no more than {awayAdv}% more than Home Team<br/>→ Proceed<br/>ELSE → Stop</>);
      else return (<>Apply {config.weight} point{config.weight !== 1 ? 's' : ''} if the {metricName} margin falls within these limits:<br/>• Home Team is no more than {homeAdv}% more than Away Team<br/>• Away Team is no more than {awayAdv}% more than Home Team<br/>ELSE → 0 points</>);
    } else if (homeMin < 0 && homeMax <= 0) {
      const threshold = Math.abs(homeMax);
      const maxAdv = Math.abs(homeMin);
      if (isArrow) {
        if (simplified) return `IF ${metricName} of Home Team is ${threshold}% or more than that of Away Team...`;
        else if (config.edgeType === 'match') return (<>IF {metricName} of Home Team is {threshold}% or more than that of Away Team<br/>→ Proceed<br/>ELSE → Stop</>);
        else return (<>IF {metricName} of Home Team is {threshold}% or more than that of Away Team<br/>→ Apply weight: {config.weight} point{config.weight !== 1 ? 's' : ''}<br/>ELSE → 0 points</>);
      } else {
        if (simplified) return `IF ${metricName} of Home Team is ${threshold}% to ${maxAdv}% more than that of Away Team...`;
        else if (config.edgeType === 'match') return (<>IF {metricName} of Home Team is {threshold}% to {maxAdv}% more than that of Away Team<br/>→ Proceed<br/>ELSE → Stop</>);
        else return (<>IF {metricName} of Home Team is {threshold}% to {maxAdv}% more than that of Away Team<br/>→ Apply weight: {config.weight} point{config.weight !== 1 ? 's' : ''}<br/>ELSE → 0 points</>);
      }
    } else {
      const minAdv = Math.abs(homeMin);
      const maxAdv = Math.abs(homeMax);
      if (simplified) return `IF ${metricName} of Away Team is ${minAdv}% to ${maxAdv}% more than that of Home Team...`;
      else if (config.edgeType === 'match') return (<>IF {metricName} of Away Team is {minAdv}% to {maxAdv}% more than that of Home Team<br/>→ Proceed<br/>ELSE → Stop</>);
      else return (<>IF {metricName} of Away Team is {minAdv}% to {maxAdv}% more than that of Home Team<br/>→ Apply weight: {config.weight} point{config.weight !== 1 ? 's' : ''}<br/>ELSE → 0 points</>);
    }
  } else if (branchId === 'away') {
    const awayMin = step.awayMin;
    const awayMax = step.awayMax;
    const isArrow = step.awayMaxIsArrow;
    
    if (awayMin < 0 && awayMax > 0) {
      const homeAdv = Math.abs(awayMin);
      const awayAdv = Math.abs(awayMax);
      if (simplified) return `IF ${metricName} margin is within away advantage limits...`;
      else if (config.edgeType === 'match') return (<>IF the {metricName} margin falls within these limits:<br/>• Home Team is no more than {homeAdv}% more than Away Team<br/>• Away Team is no more than {awayAdv}% more than Home Team<br/>→ Proceed<br/>ELSE → Stop</>);
      else return (<>Apply {config.weight} point{config.weight !== 1 ? 's' : ''} if the {metricName} margin falls within these limits:<br/>• Home Team is no more than {homeAdv}% more than Away Team<br/>• Away Team is no more than {awayAdv}% more than Home Team<br/>ELSE → 0 points</>);
    } else if (awayMin >= 0 && awayMax > 0) {
      const threshold = Math.abs(awayMin);
      const maxAdv = Math.abs(awayMax);
      if (isArrow) {
        if (simplified) return `IF ${metricName} of Away Team is ${threshold}% or more than that of Home Team...`;
        else if (config.edgeType === 'match') return (<>IF {metricName} of Away Team is {threshold}% or more than that of Home Team<br/>→ Proceed<br/>ELSE → Stop</>);
        else return (<>IF {metricName} of Away Team is {threshold}% or more than that of Home Team<br/>→ Apply weight: {config.weight} point{config.weight !== 1 ? 's' : ''}<br/>ELSE → 0 points</>);
      } else {
        if (simplified) return `IF ${metricName} of Away Team is ${threshold}% to ${maxAdv}% more than that of Home Team...`;
        else if (config.edgeType === 'match') return (<>IF {metricName} of Away Team is {threshold}% to {maxAdv}% more than that of Home Team<br/>→ Proceed<br/>ELSE → Stop</>);
        else return (<>IF {metricName} of Away Team is {threshold}% to {maxAdv}% more than that of Home Team<br/>→ Apply weight: {config.weight} point{config.weight !== 1 ? 's' : ''}<br/>ELSE → 0 points</>);
      }
    } else {
      const minAdv = Math.abs(awayMax);
      const maxAdv = Math.abs(awayMin);
      if (simplified) return `IF ${metricName} of Home Team is ${minAdv}% to ${maxAdv}% more than that of Away Team...`;
      else if (config.edgeType === 'match') return (<>IF {metricName} of Home Team is {minAdv}% to {maxAdv}% more than that of Away Team<br/>→ Proceed<br/>ELSE → Stop</>);
      else return (<>IF {metricName} of Home Team is {minAdv}% to {maxAdv}% more than that of Away Team<br/>→ Apply weight: {config.weight} point{config.weight !== 1 ? 's' : ''}<br/>ELSE → 0 points</>);
    }
  } else if (branchId === 'draw') {
    const homeLimit = Math.abs(step.drawMin);
    const awayLimit = Math.abs(step.drawMax);
    if (simplified) return `IF ${metricName} margin is within draw limits...`;
    else if (config.edgeType === 'match') return (<>IF the {metricName} margin falls within these limits:<br/>• Home Team is no more than {homeLimit}% more than Away Team<br/>• Away Team is no more than {awayLimit}% more than Home Team<br/>→ Proceed<br/>ELSE → Stop</>);
    else return (<>Apply {config.weight} point{config.weight !== 1 ? 's' : ''} if the {metricName} margin falls within these limits:<br/>• Home Team is no more than {homeLimit}% more than Away Team<br/>• Away Team is no more than {awayLimit}% more than Home Team<br/>ELSE → 0 points</>);
  }
  
  return '';
};

const ScaleLabelControl = ({ value, label, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const textAlign = label.includes('Home') ? 'left' : 'right';

  const handleClick = () => {
    if (onChange) {
      setIsEditing(true);
      setEditValue(value.toString());
    }
  };

  const handleBlur = () => {
    if (onChange) {
      const newValue = parseInt(editValue);
      if (!isNaN(newValue) && newValue >= 50) {
        onChange(newValue);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div style={{ textAlign }}>
      {isEditing ? (
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          min="50"
          style={{
            width: '50px',
            padding: '2px 4px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid #60a5fa',
            borderRadius: '4px',
            color: '#60a5fa',
            fontSize: '10px',
            fontWeight: 700,
            textAlign: 'center'
          }}
        />
      ) : (
        <div 
          onClick={handleClick}
          style={{ 
            fontWeight: 700, 
            color: onChange ? '#60a5fa' : '#94a3b8',
            cursor: onChange ? 'pointer' : 'default',
            display: 'inline-block',
            padding: '2px 4px',
            borderRadius: '4px',
            background: onChange ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
          }}
        >
          {value}
        </div>
      )}
      <div style={{ fontSize: '9px', opacity: 0.7 }}>{label}</div>
    </div>
  );
};

const RangeBar = ({ min, max, maxPercentage, color, label }) => {
  const startPercent = ((min + maxPercentage) / (maxPercentage * 2)) * 100;
  const endPercent = ((max + maxPercentage) / (maxPercentage * 2)) * 100;
  
  return (
    <div style={{
      position: 'absolute',
      top: '27px',
      left: `${startPercent}%`,
      width: `${endPercent - startPercent}%`,
      height: '18px',
      background: `${color}30`,
      border: `2px solid ${color}`,
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      <span style={{
        fontSize: '8px',
        fontWeight: 800,
        color: color,
        letterSpacing: '0.5px'
      }}>
        {label}
      </span>
    </div>
  );
};

const SliderHandle = ({ value, maxPercentage, color, onMouseDown, active, isArrow, onToggleArrow }) => {
  const percent = ((value + maxPercentage) / (maxPercentage * 2)) * 100;
  const displayValue = Math.abs(value);
  const isLeftSide = value < 0;
  
  return (
    <div
      style={{
        position: 'absolute',
        top: '35px',
        left: `${percent}%`,
        transform: `translate(-50%, -50%) scale(${active ? 1.3 : 1})`,
        cursor: 'grab',
        zIndex: active ? 50 : 20,
        transition: active ? 'none' : 'transform 0.1s ease'
      }}
    >
      {isArrow !== undefined && isArrow ? (
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleArrow) {
              onToggleArrow();
            }
          }}
          style={{
            position: 'relative',
            cursor: 'pointer',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            width: '0',
            height: '0',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            [isLeftSide ? 'borderRight' : 'borderLeft']: `14px solid ${color}`,
            position: 'relative'
          }} />
          <div style={{
            position: 'absolute',
            width: '0',
            height: '0',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            [isLeftSide ? 'borderRight' : 'borderLeft']: '11px solid white',
            [isLeftSide ? 'left' : 'right']: '3px'
          }} />
        </div>
      ) : isArrow !== undefined ? (
        <div 
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleArrow) {
              onToggleArrow();
            }
          }}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: color,
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer'
          }} 
        />
      ) : (
        <div 
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: color,
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }} 
        />
      )}
      
      {active && (
        <span style={{
          position: 'absolute',
          top: '-26px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          fontWeight: 800,
          color: 'white',
          background: color,
          padding: '3px 8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {displayValue}{isArrow ? '+' : ''}
        </span>
      )}
    </div>
  );
};

const StepConfigModal = ({ step, branch, config, maxPercentage, onUpdateMaxPercentage, onUpdateStep, onUpdateConfig, onClose, onDelete, onAdd, canDelete }) => {
  const containerRef = useRef(null);
  const [activeThumb, setActiveThumb] = useState(null);
  const [activeRange, setActiveRange] = useState(null);

  const handleSliderChange = (sliderName, value) => {
    const updates = { [sliderName]: value };
    
    if (sliderName === 'homeMin' && value > step.homeMax) return;
    if (sliderName === 'homeMax' && value < step.homeMin) return;
    if (sliderName === 'drawMin' && value > step.drawMax) return;
    if (sliderName === 'drawMax' && value < step.drawMin) return;
    if (sliderName === 'awayMin' && value > step.awayMax) return;
    if (sliderName === 'awayMax' && value < step.awayMin) return;
    
    onUpdateStep(updates);
  };

  const handleMouseDown = (e, sliderName) => {
    e.preventDefault();
    setActiveThumb(sliderName);
    
    if (sliderName.startsWith('home')) {
      setActiveRange('home');
    } else if (sliderName.startsWith('draw')) {
      setActiveRange('draw');
    } else if (sliderName.startsWith('away')) {
      setActiveRange('away');
    }

    const moveHandler = (moveEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const percentage = ((clientX - rect.left) / rect.width) * 100;
      const value = Math.round((percentage / 100) * (maxPercentage * 2) - maxPercentage);
      handleSliderChange(sliderName, value);
    };

    const upHandler = () => {
      setActiveThumb(null);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchmove', moveHandler, { passive: false });
    window.addEventListener('touchend', upHandler);
  };

  const toggleArrow = (arrowField) => {
    onUpdateStep({ [arrowField]: !step[arrowField] });
  };

  return (
    <Modal title={`Configure: ${step.metric?.name || 'Step'} (${branch.name})`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 700,
            color: '#cbd5e1',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Comparative Ranges
          </label>
          
          <div 
            ref={containerRef}
            onClick={(e) => {
              if (e.target === containerRef.current) {
                setActiveRange(null);
              }
            }}
            style={{
              position: 'relative',
              height: '70px',
              marginBottom: '12px',
              userSelect: 'none'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '35px',
              left: 0,
              right: 0,
              height: '4px',
              background: 'rgba(148, 163, 184, 0.2)',
              borderRadius: '2px'
            }} />

            <div style={{
              position: 'absolute',
              top: '25px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '24px',
              background: 'rgba(148, 163, 184, 0.5)'
            }} />
            <div style={{
              position: 'absolute',
              top: '55px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              fontWeight: 700,
              color: '#64748b'
            }}>
              0%
            </div>

            <RangeBar min={step.homeMin} max={step.homeMax} maxPercentage={maxPercentage} color="#10b981" label="HOME" />
            <RangeBar min={step.drawMin} max={step.drawMax} maxPercentage={maxPercentage} color="#94a3b8" label="DRAW" />
            <RangeBar min={step.awayMin} max={step.awayMax} maxPercentage={maxPercentage} color="#f59e0b" label="AWAY" />

            <SliderHandle value={step.homeMin} maxPercentage={maxPercentage} color="#10b981" onMouseDown={(e) => handleMouseDown(e, 'homeMin')} active={activeThumb === 'homeMin'} isArrow={step.homeMinIsArrow} onToggleArrow={() => toggleArrow('homeMinIsArrow')} />
            <SliderHandle value={step.homeMax} maxPercentage={maxPercentage} color="#10b981" onMouseDown={(e) => handleMouseDown(e, 'homeMax')} active={activeThumb === 'homeMax'} />
            <SliderHandle value={step.drawMin} maxPercentage={maxPercentage} color="#94a3b8" onMouseDown={(e) => handleMouseDown(e, 'drawMin')} active={activeThumb === 'drawMin'} />
            <SliderHandle value={step.drawMax} maxPercentage={maxPercentage} color="#94a3b8" onMouseDown={(e) => handleMouseDown(e, 'drawMax')} active={activeThumb === 'drawMax'} />
            <SliderHandle value={step.awayMin} maxPercentage={maxPercentage} color="#f59e0b" onMouseDown={(e) => handleMouseDown(e, 'awayMin')} active={activeThumb === 'awayMin'} />
            <SliderHandle value={step.awayMax} maxPercentage={maxPercentage} color="#f59e0b" onMouseDown={(e) => handleMouseDown(e, 'awayMax')} active={activeThumb === 'awayMax'} isArrow={step.awayMaxIsArrow} onToggleArrow={() => toggleArrow('awayMaxIsArrow')} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '10px',
            color: '#64748b',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            <ScaleLabelControl value={maxPercentage} label="Home Better" onChange={onUpdateMaxPercentage} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: '#94a3b8' }}>0</div>
              <div style={{ fontSize: '9px', opacity: 0.7 }}>Equal</div>
            </div>
            <ScaleLabelControl value={maxPercentage} label="Away Better" onChange={onUpdateMaxPercentage} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'monospace',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#10b981', textAlign: 'center', fontWeight: 800 }}>HOME</div>
              <div 
                onClick={() => setActiveRange('home')}
                style={{
                  textAlign: 'center', padding: '8px 6px',
                  background: activeRange === 'home' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.1)',
                  border: activeRange === 'home' ? '2px solid #10b981' : '2px solid transparent',
                  borderRadius: '6px', color: '#10b981', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {step.homeMinIsArrow ? `${Math.abs(step.homeMax)}% or more` : `${Math.abs(step.homeMax)}% to ${Math.abs(step.homeMin)}%`}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', textAlign: 'center', fontWeight: 800 }}>DRAW</div>
              <div 
                onClick={() => setActiveRange('draw')}
                style={{
                  textAlign: 'center', padding: '8px 6px',
                  background: activeRange === 'draw' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.1)',
                  border: activeRange === 'draw' ? '2px solid #94a3b8' : '2px solid transparent',
                  borderRadius: '6px', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {Math.abs(step.drawMin)}% ← | → {Math.abs(step.drawMax)}%
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#f59e0b', textAlign: 'center', fontWeight: 800 }}>AWAY</div>
              <div 
                onClick={() => setActiveRange('away')}
                style={{
                  textAlign: 'center', padding: '8px 6px',
                  background: activeRange === 'away' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.1)',
                  border: activeRange === 'away' ? '2px solid #f59e0b' : '2px solid transparent',
                  borderRadius: '6px', color: '#f59e0b', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {step.awayMaxIsArrow ? `${Math.abs(step.awayMin)}% or more` : `${Math.abs(step.awayMin)}% to ${Math.abs(step.awayMax)}%`}
              </div>
            </div>
          </div>

          {activeRange && step.metric && (
            <div style={{
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#cbd5e1',
              lineHeight: '1.6',
              fontFamily: 'monospace'
            }}>
              {generatePlainEnglishJSX(step, activeRange, config, false)}
            </div>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 700,
            color: '#cbd5e1',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Edge Type for {branch.name}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => onUpdateConfig('edgeType', 'match')}
              style={{
                padding: '16px',
                background: config.edgeType === 'match' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                border: config.edgeType === 'match' ? '2px solid #3b82f6' : '2px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '10px',
                color: config.edgeType === 'match' ? '#60a5fa' : '#94a3b8',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
              }}
            >
              <Target size={20} />
              <span>Match</span>
              <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 500 }}>Pass/Fail (stops)</span>
            </button>
            <button
              onClick={() => onUpdateConfig('edgeType', 'weight')}
              style={{
                padding: '16px',
                background: config.edgeType === 'weight' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                border: config.edgeType === 'weight' ? '2px solid #8b5cf6' : '2px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '10px',
                color: config.edgeType === 'weight' ? '#a78bfa' : '#94a3b8',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
              }}
            >
              <Scale size={20} />
              <span>Weight</span>
              <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 500 }}>Adds points</span>
            </button>
          </div>
        </div>

        {config.edgeType === 'weight' && (
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1',
              marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              Weight Value
            </label>
            <div style={{
              padding: '20px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '10px'
            }}>
              <input
                type="range" min="0" max="10"
                value={config.weight}
                onChange={(e) => onUpdateConfig('weight', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6', marginBottom: '12px' }}
              />
              <div style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, color: '#a78bfa' }}>
                {config.weight}
              </div>
              {config.weight === 0 && (
                <div style={{
                  marginTop: '12px', padding: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '6px', fontSize: '11px', color: '#fbbf24',
                  textAlign: 'center', fontWeight: 600
                }}>
                  ⚠️ Weight 0 = This step will be skipped
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom buttons: Delete + Add */}
        <div style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          {canDelete && (
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <X size={14} />
              Delete Step
            </button>
          )}
          <button
            onClick={() => { onAdd(); onClose(); }}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={14} />
            Add Step
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Modal = ({ title, children, onClose, onBack }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '2px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  background: 'rgba(148, 163, 184, 0.15)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              color: '#f1f5f9'
            }}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const MetricSelectorModal = ({ categories, onSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (selectedCategory) {
    return (
      <Modal
        title={selectedCategory.name}
        onClose={() => { setSelectedCategory(null); onClose(); }}
        onBack={() => setSelectedCategory(null)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedCategory.metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => onSelect(metric)}
              style={{
                padding: '16px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: `2px solid ${metric.color}30`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${metric.color}15`;
                e.currentTarget.style.borderColor = metric.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                e.currentTarget.style.borderColor = `${metric.color}30`;
              }}
            >
              <div style={{
                display: 'inline-block',
                padding: '3px 8px',
                background: `${metric.color}20`,
                border: `1px solid ${metric.color}50`,
                borderRadius: '5px',
                fontSize: '9px',
                fontWeight: 700,
                color: metric.color,
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {metric.category}
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#f1f5f9'
              }}>
                {metric.name}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Select Category" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '16px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: `2px solid ${cat.color}30`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${cat.color}15`;
                e.currentTarget.style.borderColor = cat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                e.currentTarget.style.borderColor = `${cat.color}30`;
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${cat.color}20`,
                border: `1px solid ${cat.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} color={cat.color} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  {cat.metrics.length} metrics
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════
export default function StrategyStudio() {
  return (
    <ReactFlowProvider>
      <StudioInner />
    </ReactFlowProvider>
  );
}
