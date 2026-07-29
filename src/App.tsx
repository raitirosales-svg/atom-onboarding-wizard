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
import { FlowPlanExportModal } from './components/FlowPlanExportModal';
import { NodeType, WhatsAppNodeData, ProjectMetadata } from './types';
import { useLanguage } from './i18n';
import { supabase, signIn, signUp, signOut, getCurrentUser } from './utils/supabaseClient';

const STORAGE_KEY = 'atom_scope_current_project';

function loadSavedProject(): { nodes: Node<WhatsAppNodeData>[]; edges: Edge[]; meta: ProjectMetadata } | null {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return null;
}
function saveProject(nodes: Node<WhatsAppNodeData>[], edges: Edge[], meta: ProjectMetadata) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, meta })); } catch {}
}

const defaultMeta: ProjectMetadata = {
  name: '', clientName: '', description: '',
  industry: '', objective: '', author: '',
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

// ── Auth ──
const AUTH_KEY = 'atom_auth_session';
function getSession() { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; } }
function setSession(u: any) { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function clearSession() { localStorage.removeItem(AUTH_KEY); localStorage.removeItem(STORAGE_KEY); }

export default function App() {
  const { t } = useLanguage();
  const saved = useMemo(() => loadSavedProject(), []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(!saved || !saved.meta?.clientName);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WhatsAppNodeData>>(saved?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(saved?.edges || []);
  const [projectMeta, setProjectMeta] = useState<ProjectMetadata>(saved?.meta || defaultMeta);

  // Undo
  const historyRef = useRef<Array<{ nodes: Node<WhatsAppNodeData>[]; edges: Edge[] }>>([]);
  const pushHistory = useCallback(() => {
    historyRef.current.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    if (historyRef.current.length > 50) historyRef.current.shift();
  }, [nodes, edges]);

  useEffect(() => { if (isLoggedIn) saveProject(nodes, edges, projectMeta); }, [nodes, edges, projectMeta, isLoggedIn]);

  // Supabase session check on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email);
      }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email);
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const nodeTypes = useMemo(() => ({ customWhatsAppNode: CustomWhatsAppNode }), []);

  const onConnect = useCallback((p: Connection) => setEdges((eds) => addEdge(p, eds)), [setEdges]);
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => setSelectedNodeId(node.id), []);
  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  const handleNewProject = useCallback(() => {
    setNodes([]); setEdges([]); setProjectMeta(defaultMeta);
    setShowSetup(true); setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  const handleUndo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) { setNodes(prev.nodes); setEdges(prev.edges); }
  }, [setNodes, setEdges]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo]);

  const handleAddNode = useCallback((type: NodeType) => {
    pushHistory();
    const id = `node-${Date.now()}`;
    const newNode: Node<WhatsAppNodeData> = {
      id, type: 'customWhatsAppNode',
      position: { x: 250 + (nodes.length % 5) * 40, y: 150 + (nodes.length % 5) * 40 },
      data: {
        nodeType: type, label: getInitialLabel(type, t), description: '',
        options: type === 'eval_response' || type === 'smarton' ? ['Opción 1', 'Opción 2'] : undefined,
        fieldName: type === 'save_field' || type === 'customer_stage' ? 'var_campo' : undefined,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  }, [nodes.length, setNodes, pushHistory, t]);

  const handleUpdateNodeData = useCallback((id: string, d: Partial<WhatsAppNodeData>) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, ...d } } : n));
  }, [setNodes]);

  const handleDeleteNode = useCallback((id: string) => {
    pushHistory();
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges, pushHistory]);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  const handleLogout = useCallback(async () => {
    await signOut();
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Loading
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--atom-navy)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-[var(--atom-orange)]" />
      </div>
    );
  }

  // ── LOGIN ──
  if (!isLoggedIn) {
    return <LoginPage onLogin={(email) => { setUserEmail(email); }} t={t} />;
  }

  // ── SETUP ──
  if (showSetup) {
    return <SetupPage meta={projectMeta} onSave={(meta) => { setProjectMeta(meta); setShowSetup(false); }} onLogout={handleLogout} userEmail={userEmail} t={t} />;
  }

  // ── CANVAS ──
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--atom-light)] font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <Header
        projectMeta={projectMeta} onUpdateProjectMeta={setProjectMeta}
        nodeCount={nodes.length} edgeCount={edges.length}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onNewProject={handleNewProject} onUndo={handleUndo}
        canUndo={historyRef.current.length > 0}
        onSetup={() => setShowSetup(true)}
        onLogout={handleLogout}
        userEmail={userEmail}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNodePalette onAddNode={handleAddNode} projectMeta={projectMeta} onUpdateProjectMeta={setProjectMeta} />
        <main className="relative flex-1 bg-[var(--atom-light)] dark:bg-slate-900">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-slate-400">
                <div className="text-5xl mb-4">🖱️</div>
                <p className="text-lg font-semibold">{t('dragNodesHint') || 'Arrastra nodos desde la paleta izquierda'}</p>
              </div>
            </div>
          )}
          <ReactFlow
            nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={onNodeClick} onPaneClick={onPaneClick}
            nodeTypes={nodeTypes} fitView
            deleteKeyCode={['Backspace', 'Delete']}
            onNodesDelete={() => pushHistory()} onEdgesDelete={() => pushHistory()}
            defaultEdgeOptions={{ type: 'smoothstep', animated: true, style: { stroke: '#FF6600', strokeWidth: 2 } }}
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
      <FlowPlanExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}
        nodes={nodes} edges={edges} projectMeta={projectMeta} />
    </div>
  );
}

// ── LOGIN PAGE (Supabase Auth) ──
function LoginPage({ onLogin, t }: { onLogin: (email: string) => void; t: (k: string) => string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setError('Revisa tu correo para confirmar la cuenta.');
      } else {
        await signIn(email, password);
        onLogin(email);
      }
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--atom-navy)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <svg viewBox="0 0 100 100" className="mx-auto h-16 w-16" fill="none">
            <defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FF6000"/><stop offset="100%" stopColor="#E04800"/></linearGradient></defs>
            <circle cx="50" cy="50" r="46" fill="url(#lg2)"/>
            <path d="M44 41C36.268 41 30 47.268 30 55C30 58.2 31.1 61.15 32.9 63.5L30.5 70.5L37.5 68.1C39.5 69.3 41.7 70 44 70C51.732 70 58 63.732 58 55C58 47.268 51.732 41 44 41Z" fill="#FFF"/>
            <circle cx="40" cy="54" r="2.2" fill="#0F172A"/><circle cx="48" cy="54" r="2.2" fill="#0F172A"/>
          </svg>
          <h1 className="mt-4 text-xl font-extrabold text-slate-900">ATOM Onboarding</h1>
          <p className="mt-1 text-sm text-slate-500">{isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Correo</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-[var(--atom-orange)] focus:outline-none"
              placeholder="tu@atomchat.io" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-[var(--atom-orange)] focus:outline-none"
              placeholder="••••••••" required minLength={6} />
          </div>
          {error && <p className={`text-xs font-semibold ${error.includes('Revisa') ? 'text-green-600' : 'text-red-500'}`}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-[var(--atom-orange)] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#e55a00] disabled:opacity-50">
            {loading ? 'Cargando...' : isSignUp ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="font-bold text-[var(--atom-orange)] hover:underline">
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
}

// ── SETUP PAGE ──
function SetupPage({ meta, onSave, onLogout, userEmail, t }: {
  meta: ProjectMetadata; onSave: (m: ProjectMetadata) => void;
  onLogout: () => void; userEmail: string; t: (k: string) => string;
}) {
  const [form, setForm] = useState(meta);
  const handleChange = (field: keyof ProjectMetadata, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--atom-light)] px-4 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900 dark:text-white">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('projectMetadataTitle') || 'Información del Proyecto'}</h1>
            <p className="text-sm text-slate-500">{t('setupSubtitle') || 'Datos del cliente necesarios para FlowBuilder'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{userEmail}</span>
            <button onClick={onLogout} className="text-xs text-red-400 hover:underline">Salir</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{t('projectNameLabel') || 'Nombre del Proyecto'}</label>
            <input value={form.name} onChange={e => handleChange('name', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              placeholder="Ej: Hansa Automotriz v1" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{t('clientNameLabel') || 'Cliente / Empresa'}</label>
            <input value={form.clientName} onChange={e => handleChange('clientName', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              placeholder="Ej: Hansa" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{t('industryLabel') || 'Industria'}</label>
            <select value={form.industry} onChange={e => handleChange('industry', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800">
              <option value="">{t('selectIndustry') || 'Seleccionar...'}</option>
              {['E-commerce','Salud','Servicios Financieros','Inmobiliario','Educación','Retail','Automotriz','Otro'].map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{t('authorLabel') || 'Onboarding a cargo'}</label>
            <input value={form.author || userEmail} onChange={e => handleChange('author', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{t('objectiveLabel') || 'Objetivo del Bot'}</label>
            <textarea value={form.objective} onChange={e => handleChange('objective', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              rows={3} placeholder="¿Qué debe lograr este bot? Ej: Reducir tiempo de respuesta, calificar leads, agendar citas..." />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{t('toneLabel') || 'Tono de la marca'}</label>
            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-[var(--atom-orange)] focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              rows={2} placeholder="Ej: Profesional, amable, emojis moderados. Dirigirse al cliente por su primer nombre." />
          </div>
        </div>

        <button onClick={() => onSave(form)}
          className="mt-6 w-full rounded-lg bg-[var(--atom-orange)] py-3 text-sm font-bold text-white transition-colors hover:bg-[#e55a00]">
          {t('startBuilding') || 'Iniciar construcción del flujo'}
        </button>
      </div>
    </div>
  );
}
