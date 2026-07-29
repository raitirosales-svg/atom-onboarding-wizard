import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, Edge, Node, BackgroundVariant } from '@xyflow/react';
import { CustomWhatsAppNode } from './components/CustomWhatsAppNode';
import { SidebarNodePalette } from './components/SidebarNodePalette';
import { NodeInspector } from './components/NodeInspector';
import { Header } from './components/Header';
import { FlowPlanExportModal } from './components/FlowPlanExportModal';
import { NodeType, WhatsAppNodeData, ProjectMetadata } from './types';
import { useLanguage } from './i18n';

const STORAGE_KEY = 'atom_onboarding_state';
const ACCESS_CODE = 'atom2024';

function loadState() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveState(nodes: any[], edges: any[], meta: ProjectMetadata) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, meta })); } catch {}
}

function getLabel(type: NodeType, t: (k: string) => string): string {
  const m: Record<string, string> = {
    message: 'nodeMessageLabel', template: 'nodeTemplateLabel', eval_response: 'nodeEvalResponseLabel',
    condition: 'nodeConditionLabel', jump: 'nodeJumpLabel', typification: 'nodeTypificationLabel',
    delay: 'nodeDelayLabel', save_field: 'nodeSaveFieldLabel', smarton: 'nodeSmartonLabel',
    format: 'nodeFormatLabel', tag: 'nodeTagLabel', customer_stage: 'nodeCustomerStageLabel',
    assign_group: 'nodeAssignGroupLabel', crm: 'nodeCrmLabel',
  };
  return t(m[type] || 'nodeMessageLabel');
}

export default function App() {
  const { t } = useLanguage();
  const state = useMemo(() => loadState(), []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showSetup, setShowSetup] = useState(!state?.meta?.clientName);
  const [showExport, setShowExport] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WhatsAppNodeData>>(state?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(state?.edges || []);
  const [projectMeta, setProjectMeta] = useState<ProjectMetadata>(state?.meta || { name: '', clientName: '', description: '', industry: '', objective: '', author: '' });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({ customWhatsAppNode: CustomWhatsAppNode }), []);
  const onConnect = useCallback((p: Connection) => setEdges(eds => addEdge(p, eds)), [setEdges]);
  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  // Persist
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { if (!isLoggedIn) return; clearTimeout(saveTimer.current); saveTimer.current = setTimeout(() => saveState(nodes, edges, projectMeta), 1000); }, [nodes, edges, projectMeta, isLoggedIn]);

  // Undo
  const undoStack = useRef<Array<{ nodes: Node<WhatsAppNodeData>[]; edges: Edge[] }>>([]);
  const pushUndo = useCallback(() => {
    undoStack.current.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    if (undoStack.current.length > 50) undoStack.current.shift();
  }, [nodes, edges]);
  const handleUndo = useCallback(() => { const p = undoStack.current.pop(); if (p) { setNodes(p.nodes); setEdges(p.edges); } }, [setNodes, setEdges]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [handleUndo]);

  const handleAddNode = useCallback((type: NodeType) => {
    pushUndo();
    const id = `n_${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type: 'customWhatsAppNode',
      position: { x: 300 + (nds.length % 4) * 320, y: 150 + Math.floor(nds.length / 4) * 220 },
      data: { nodeType: type, label: getLabel(type, t), description: '', options: (type === 'eval_response' || type === 'smarton') ? ['Opción 1', 'Opción 2'] : undefined, fieldName: (type === 'save_field' || type === 'customer_stage') ? 'var_campo' : undefined },
    }]);
  }, [setNodes, pushUndo, t]);

  const handleUpdateNode = useCallback((id: string, d: Partial<WhatsAppNodeData>) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...d } } : n));
  }, [setNodes]);

  const handleDeleteNode = useCallback((id: string) => {
    pushUndo(); setNodes(nds => nds.filter(n => n.id !== id)); setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges, pushUndo]);

  const handleNewProject = useCallback(() => { pushUndo(); setNodes([]); setEdges([]); setProjectMeta({ name: '', clientName: '', description: '', industry: '', objective: '', author: '' }); setShowSetup(true); }, [setNodes, setEdges, pushUndo]);
  const handleSetupDone = useCallback((meta: ProjectMetadata) => { setProjectMeta(meta); setShowSetup(false); }, []);

  if (!isLoggedIn) return <LoginPage onLogin={(e) => { setUserEmail(e); setIsLoggedIn(true); }} />;
  if (showSetup) return <SetupPage meta={projectMeta} onSave={handleSetupDone} onLogout={() => setIsLoggedIn(false)} userEmail={userEmail} />;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--atom-light)] font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <Header projectMeta={projectMeta} onUpdateProjectMeta={setProjectMeta} nodeCount={nodes.length} edgeCount={edges.length}
        onOpenExportModal={() => setShowExport(true)} onNewProject={handleNewProject} onUndo={handleUndo}
        canUndo={undoStack.current.length > 0} onSetup={() => setShowSetup(true)} onLogout={() => setIsLoggedIn(false)} userEmail={userEmail} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNodePalette onAddNode={handleAddNode} />
        <main className="relative flex-1 bg-[var(--atom-light)] dark:bg-slate-900">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-slate-400"><div className="text-5xl mb-4">🖱️</div><p className="text-lg font-semibold">Haz clic en los componentes de la izquierda para empezar</p></div>
            </div>
          )}
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={(_, n) => setSelectedNodeId(n.id)} onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes} fitView deleteKeyCode={['Backspace','Delete']}
            onNodesDelete={() => pushUndo()} onEdgesDelete={() => pushUndo()}
            defaultEdgeOptions={{ type: 'smoothstep', animated: true, style: { stroke: '#FF6600', strokeWidth: 2 } }}>
            <Controls className="!border-slate-200 !bg-white !shadow-md dark:!border-slate-800 dark:!bg-slate-900" />
            <MiniMap zoomable pannable className="!border-slate-200 !bg-white !shadow-md dark:!border-slate-800 dark:!bg-slate-900" />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          </ReactFlow>
        </main>
        {selectedNode && <NodeInspector selectedNode={selectedNode} onUpdateNodeData={handleUpdateNode} onDeleteNode={handleDeleteNode} onClose={() => setSelectedNodeId(null)} />}
      </div>
      <FlowPlanExportModal isOpen={showExport} onClose={() => setShowExport(false)} nodes={nodes} edges={edges} projectMeta={projectMeta} />
    </div>
  );
}

// ── LOGIN ──
function LoginPage({ onLogin }: { onLogin: (e: string) => void }) {
  const [email, setEmail] = useState(''); const [code, setCode] = useState(''); const [error, setError] = useState('');
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--atom-navy)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <svg viewBox="0 0 100 100" className="mx-auto h-16 w-16" fill="none"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FF6000"/><stop offset="100%" stopColor="#E04800"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#lg)"/><path d="M44 41C36.268 41 30 47.268 30 55C30 58.2 31.1 61.15 32.9 63.5L30.5 70.5L37.5 68.1C39.5 69.3 41.7 70 44 70C51.732 70 58 63.732 58 55C58 47.268 51.732 41 44 41Z" fill="#FFF"/><circle cx="40" cy="54" r="2.2" fill="#0F172A"/><circle cx="48" cy="54" r="2.2" fill="#0F172A"/></svg>
          <h1 className="mt-4 text-xl font-extrabold text-slate-900">ATOM Onboarding</h1>
          <p className="mt-1 text-sm text-slate-500">Herramienta interna</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (!email.includes('@')) { setError('Correo inválido'); return; } if (code !== ACCESS_CODE) { setError('Código incorrecto'); return; } onLogin(email); }} className="space-y-4">
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600">Correo</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-[var(--atom-orange)] focus:outline-none" placeholder="tu@atomchat.io" required /></div>
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600">Código de acceso</label><input type="password" value={code} onChange={e => setCode(e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-[var(--atom-orange)] focus:outline-none" placeholder="••••••••" required /></div>
          {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-[var(--atom-orange)] py-2.5 text-sm font-bold text-white hover:bg-[#e55a00]">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

// ── SETUP ──
function SetupPage({ meta, onSave, onLogout, userEmail }: { meta: ProjectMetadata; onSave: (m: ProjectMetadata) => void; onLogout: () => void; userEmail: string }) {
  const [f, setF] = useState(meta);
  const ch = (k: keyof ProjectMetadata, v: string) => setF(p => ({ ...p, [k]: v }));
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--atom-light)] px-4 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900 dark:text-white">
        <div className="mb-6 flex items-center justify-between"><div><h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Información del Proyecto</h1><p className="text-sm text-slate-500">Datos necesarios para FlowBuilder</p></div><div className="flex items-center gap-2"><span className="text-xs text-slate-400">{userEmail}</span><button onClick={onLogout} className="text-xs text-red-400 hover:underline">Salir</button></div></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Nombre del Proyecto *</label><input value={f.name} onChange={e => ch('name', e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800" placeholder="Ej: Banco Digital v1" /></div>
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Cliente / Empresa *</label><input value={f.clientName} onChange={e => ch('clientName', e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800" placeholder="Ej: Banco Digital" /></div>
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Industria</label><select value={f.industry} onChange={e => ch('industry', e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800"><option value="">Seleccionar...</option>{['E-commerce','Salud','Servicios Financieros','Inmobiliario','Educación','Retail','Automotriz','Otro'].map(i => <option key={i} value={i}>{i}</option>)}</select></div>
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Autor</label><input value={f.author || userEmail} onChange={e => ch('author', e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800" /></div>
        </div>
        <div className="mt-4 space-y-4">
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Objetivo del Bot</label><textarea value={f.objective} onChange={e => ch('objective', e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800" rows={3} placeholder="¿Qué debe lograr este bot?" /></div>
          <div><label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Tono de la marca</label><textarea value={f.description} onChange={e => ch('description', e.target.value)} className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800" rows={2} placeholder="Ej: Profesional, amable, emojis moderados." /></div>
        </div>
        <button onClick={() => onSave(f)} className="mt-6 w-full rounded-lg bg-[var(--atom-orange)] py-3 text-sm font-bold text-white hover:bg-[#e55a00]">Iniciar construcción del flujo</button>
      </div>
    </div>
  );
}
