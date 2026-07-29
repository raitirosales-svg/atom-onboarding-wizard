import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow, MiniMap, Controls, Background,
  useNodesState, useEdgesState, addEdge,
  Connection, Edge, Node, BackgroundVariant,
} from '@xyflow/react';
import { CustomWhatsAppNode } from './components/CustomWhatsAppNode';
import { SidebarNodePalette } from './components/SidebarNodePalette';
import { NodeInspector } from './components/NodeInspector';
import { Header } from './components/Header';
import { FichaTecnicaModal } from './components/FichaTecnicaModal';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal';
import { FlowPlanExportModal } from './components/FlowPlanExportModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NodeType, WhatsAppNodeData, ProjectMetadata } from './types';
import { PREBUILT_TEMPLATES } from './data/templates';
import { useLanguage } from './i18n';

const STORAGE_KEY = 'atom_scope_current_project';

function loadSavedProject(): { nodes: Node<WhatsAppNodeData>[]; edges: Edge[]; meta: ProjectMetadata } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveProject(nodes: Node<WhatsAppNodeData>[], edges: Edge[], meta: ProjectMetadata) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, meta }));
  } catch {}
}

const initialProjectMeta: ProjectMetadata = {
  name: 'Nuevo Proyecto',
  clientName: '',
  description: '',
  industry: 'Retail & Ecommerce',
  objective: '',
  author: '',
};

function getInitialLabel(type: NodeType, t: (k: string) => string): string {
  const map: Record<string, string> = {
    message: 'nodeMessageLabel', template: 'nodeTemplateLabel',
    eval_response: 'nodeEvalResponseLabel', condition: 'nodeConditionLabel',
    jump: 'nodeJumpLabel', typification: 'nodeTypificationLabel',
    delay: 'nodeDelayLabel', save_field: 'nodeSaveFieldLabel',
    smarton: 'nodeSmartonLabel', format: 'nodeFormatLabel',
    tag: 'nodeTagLabel', customer_stage: 'nodeCustomerStageLabel',
    assign_group: 'nodeAssignGroupLabel', crm: 'nodeCrmLabel',
  };
  return t(map[type] || 'nodeMessageLabel');
}

export default function App() {
  const { t } = useLanguage();

  // ── Project State ──
  const saved = useMemo(() => loadSavedProject(), []);
  const [hasStarted, setHasStarted] = useState(!!saved);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WhatsAppNodeData>>(
    saved?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(saved?.edges || []);
  const [projectMeta, setProjectMeta] = useState<ProjectMetadata>(
    saved?.meta || initialProjectMeta
  );

  // ── Undo ──
  const historyRef = useRef<Array<{ nodes: Node<WhatsAppNodeData>[]; edges: Edge[] }>>([]);
  const pushHistory = useCallback(() => {
    historyRef.current.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    if (historyRef.current.length > 50) historyRef.current.shift();
  }, [nodes, edges]);

  // ── Auto-save ──
  useEffect(() => {
    if (hasStarted) saveProject(nodes, edges, projectMeta);
  }, [nodes, edges, projectMeta, hasStarted]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isFichaTecnicaOpen, setIsFichaTecnicaOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiSuggestionsOpen, setIsAiSuggestionsOpen] = useState(false);

  const nodeTypes = useMemo(() => ({ customWhatsAppNode: CustomWhatsAppNode }), []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  // ── New Project ──
  const handleNewProject = useCallback((templateId?: string) => {
    pushHistory();
    if (templateId) {
      const tmpl = PREBUILT_TEMPLATES.find(t => t.id === templateId);
      if (tmpl) {
        setNodes(tmpl.nodes as Node<WhatsAppNodeData>[]);
        setEdges(tmpl.edges);
        setProjectMeta(tmpl.projectMeta);
        setHasStarted(true);
        setSelectedNodeId(null);
        return;
      }
    }
    setNodes([]);
    setEdges([]);
    setProjectMeta({ ...initialProjectMeta, name: 'Nuevo Proyecto' });
    setHasStarted(true);
    setSelectedNodeId(null);
  }, [setNodes, setEdges, pushHistory]);

  // ── Undo ──
  const handleUndo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) {
      setNodes(prev.nodes);
      setEdges(prev.edges);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo]);

  const handleAddNode = useCallback(
    (type: NodeType) => {
      pushHistory();
      const id = `node-${Date.now()}`;
      const newNode: Node<WhatsAppNodeData> = {
        id, type: 'customWhatsAppNode',
        position: { x: 250 + (nodes.length % 5) * 40, y: 150 + (nodes.length % 5) * 40 },
        data: {
          nodeType: type,
          label: getInitialLabel(type, t),
          description: '',
          options: type === 'eval_response' || type === 'smarton' ? ['Opción 1', 'Opción 2'] : undefined,
          fieldName: type === 'save_field' || type === 'customer_stage' ? 'var_campo' : undefined,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
    },
    [nodes.length, setNodes, pushHistory, t]
  );

  const handleUpdateNodeData = useCallback(
    (id: string, newPartialData: Partial<WhatsAppNodeData>) => {
      setNodes((nds) => nds.map((node) => {
        if (node.id === id) return { ...node, data: { ...node.data, ...newPartialData } };
        return node;
      }));
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      pushHistory();
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      if (selectedNodeId === id) setSelectedNodeId(null);
    },
    [selectedNodeId, setNodes, setEdges, pushHistory]
  );

  const handleLoadTemplate = useCallback(
    (templateId: string) => {
      pushHistory();
      const tmpl = PREBUILT_TEMPLATES.find((t) => t.id === templateId);
      if (tmpl) {
        setNodes(tmpl.nodes as Node<WhatsAppNodeData>[]);
        setEdges(tmpl.edges);
        setProjectMeta(tmpl.projectMeta);
        setSelectedNodeId(null);
      }
    },
    [setNodes, setEdges, pushHistory]
  );

  const handleApplyGeneratedFlow = useCallback(
    (newNodes: Node<WhatsAppNodeData>[], newEdges: Edge[]) => {
      pushHistory();
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNodeId(null);
    },
    [setNodes, setEdges, pushHistory]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  // ── LANDING PAGE ──
  if (!hasStarted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--atom-light)] px-4 dark:bg-slate-950">
        <div className="text-center max-w-2xl">
          <div className="mb-6 flex justify-center">
            <svg viewBox="0 0 100 100" className="h-24 w-24" fill="none">
              <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FF6000"/><stop offset="100%" stopColor="#E04800"/></linearGradient></defs>
              <circle cx="50" cy="50" r="46" fill="url(#lg)"/>
              <path d="M44 41C36.268 41 30 47.268 30 55C30 58.2 31.1 61.15 32.9 63.5L30.5 70.5L37.5 68.1C39.5 69.3 41.7 70 44 70C51.732 70 58 63.732 58 55C58 47.268 51.732 41 44 41Z" fill="#FFFFFF"/>
              <circle cx="40" cy="54" r="2.2" fill="#0F172A"/><circle cx="48" cy="54" r="2.2" fill="#0F172A"/>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">ATOM Onboarding Wizard</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
            {t('appName')} — Diseña flujos conversacionales para WhatsApp y expórtalos a FlowBuilder.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            <button onClick={() => handleNewProject()} className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-slate-600 transition-all hover:border-[var(--atom-orange)] hover:text-[var(--atom-orange)] hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <span className="text-4xl">📄</span>
              <span className="font-bold">{t('createProject')}</span>
              <span className="text-xs">Empezar desde cero</span>
            </button>

            {PREBUILT_TEMPLATES.map(tmpl => (
              <button key={tmpl.id} onClick={() => handleNewProject(tmpl.id)} className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-8 text-slate-700 transition-all hover:border-[var(--atom-orange)] hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <span className="text-4xl">{tmpl.id === 'ecommerce' ? '🛒' : tmpl.id === 'salud' ? '🏥' : '🏢'}</span>
                <span className="font-bold">{tmpl.projectMeta?.name || tmpl.name}</span>
                <span className="text-xs text-slate-400">{tmpl.projectMeta?.industry || ''}</span>
              </button>
            ))}
          </div>

          {saved && (
            <button onClick={() => setHasStarted(true)} className="text-sm text-slate-400 hover:text-[var(--atom-orange)] underline">
              Continuar proyecto guardado
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── CANVAS ──
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--atom-light)] font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <Header
        projectMeta={projectMeta}
        onUpdateProjectMeta={setProjectMeta}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        onOpenFichaTecnica={() => setIsFichaTecnicaOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAiSuggestions={() => setIsAiSuggestionsOpen(true)}
        onNewProject={() => handleNewProject()}
        onUndo={handleUndo}
        canUndo={historyRef.current.length > 0}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarNodePalette
          onAddNode={handleAddNode}
          projectMeta={projectMeta}
          onUpdateProjectMeta={setProjectMeta}
          onLoadTemplate={handleLoadTemplate}
        />

        <main className="relative flex-1 bg-[var(--atom-light)] dark:bg-slate-900">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-slate-400">
                <div className="text-5xl mb-4">🖱️</div>
                <p className="text-lg font-semibold">Arrastra nodos desde la paleta izquierda</p>
                <p className="text-sm">o haz clic en los componentes para agregarlos al canvas</p>
              </div>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            onNodesDelete={(deleted) => { pushHistory(); }}
            onEdgesDelete={(deleted) => { pushHistory(); }}
            defaultEdgeOptions={{
              type: 'smoothstep', animated: true,
              style: { stroke: '#FF6600', strokeWidth: 2 },
            }}
          >
            <Controls className="!border-slate-200 !bg-white !shadow-md dark:!border-slate-800 dark:!bg-slate-900" />
            <MiniMap zoomable pannable className="!border-slate-200 !bg-white !shadow-md dark:!border-slate-800 dark:!bg-slate-900" />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          </ReactFlow>
        </main>

        {selectedNode && (
          <NodeInspector selectedNode={selectedNode} onUpdateNodeData={handleUpdateNodeData}
            onDeleteNode={handleDeleteNode} onClose={() => setSelectedNodeId(null)} />
        )}
      </div>

      <FichaTecnicaModal isOpen={isFichaTecnicaOpen} onClose={() => setIsFichaTecnicaOpen(false)}
        projectMeta={projectMeta} nodes={nodes} edges={edges} />
      <WhatsAppSimulatorModal isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)}
        nodes={nodes} edges={edges} />
      <FlowPlanExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}
        nodes={nodes} edges={edges} projectMeta={projectMeta} />
      <AiAssistantModal isOpen={isAiSuggestionsOpen} onClose={() => setIsAiSuggestionsOpen(false)}
        nodes={nodes} edges={edges} projectMeta={projectMeta}
        onApplyGeneratedFlow={handleApplyGeneratedFlow} />
    </div>
  );
}
