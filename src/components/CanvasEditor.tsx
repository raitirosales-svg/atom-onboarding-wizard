import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import {
  ReactFlow,
  Controls,
  ControlButton,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  ReactFlowInstance,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Project, ProjectVersion, NodeComment } from '../types/canvas';
import { CustomNode } from './CustomNode';
import { NodePalette } from './NodePalette';
import { NodeInspector } from './NodeInspector';
import { CommentsDrawer } from './CommentsDrawer';
import { ContextoDrawer } from './ContextoDrawer';
import { FichaTecnicaModal } from './FichaTecnicaModal';

import {
  ArrowLeft,
  Save,
  FileText,
  MessageSquare,
  Sparkles,
  Check,
  Plus,
  Layers,
  Zap,
  Undo2,
  Redo2,
} from 'lucide-react';

interface CanvasSnapshot {
  nodes: Node[];
  edges: Edge[];
}

const MAX_HISTORY = 50;

interface CanvasEditorProps {
  project: Project;
  initialVersionNumber: number;
  onSaveProject: (updatedProject: Project) => void;
  onBackToProjects: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  project,
  initialVersionNumber,
  onSaveProject,
  onBackToProjects,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [currentVersionNumber, setCurrentVersionNumber] = useState<number>(initialVersionNumber);

  // Find version or default
  const activeVersion = useMemo(() => {
    return (
      project.versions.find((v) => v.versionNumber === currentVersionNumber) ||
      project.versions[project.versions.length - 1] || {
        versionNumber: 1,
        versionLabel: 'v1',
        createdAt: new Date().toISOString(),
        nodes: [],
        edges: [],
        comments: [],
      }
    );
  }, [project, currentVersionNumber]);

  const [nodes, setNodes, onNodesChange] = useNodesState(activeVersion.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeVersion.edges || []);
  const [allComments, setAllComments] = useState<NodeComment[]>(activeVersion.comments || []);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [showContextoDrawer, setShowContextoDrawer] = useState(Boolean(project.contexto));
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Undo / Redo History Engine
  const pastRef = useRef<CanvasSnapshot[]>([]);
  const futureRef = useRef<CanvasSnapshot[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const dragStartSnapshotRef = useRef<CanvasSnapshot | null>(null);
  const isEditingRef = useRef(false);
  const editTimerRef = useRef<any>(null);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Reset history on version switch or project load
  useEffect(() => {
    pastRef.current = [];
    futureRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
  }, [currentVersionNumber, project.id]);

  const updateUndoRedoState = useCallback(() => {
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  const takeSnapshot = useCallback((nodesToSave?: Node[], edgesToSave?: Edge[]) => {
    const n = nodesToSave || nodesRef.current;
    const e = edgesToSave || edgesRef.current;
    const snapshot: CanvasSnapshot = {
      nodes: JSON.parse(JSON.stringify(n)),
      edges: JSON.parse(JSON.stringify(e)),
    };

    pastRef.current = [...pastRef.current.slice(-MAX_HISTORY + 1), snapshot];
    futureRef.current = [];
    updateUndoRedoState();
  }, [updateUndoRedoState]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;

    const previousState = pastRef.current.pop()!;
    const currentState: CanvasSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodesRef.current)),
      edges: JSON.parse(JSON.stringify(edgesRef.current)),
    };

    futureRef.current.push(currentState);
    if (futureRef.current.length > MAX_HISTORY) {
      futureRef.current.shift();
    }

    setNodes(previousState.nodes);
    setEdges(previousState.edges);
    updateUndoRedoState();
  }, [setNodes, setEdges, updateUndoRedoState]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    const nextState = futureRef.current.pop()!;
    const currentState: CanvasSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodesRef.current)),
      edges: JSON.parse(JSON.stringify(edgesRef.current)),
    };

    pastRef.current.push(currentState);
    if (pastRef.current.length > MAX_HISTORY) {
      pastRef.current.shift();
    }

    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    updateUndoRedoState();
  }, [setNodes, setEdges, updateUndoRedoState]);

  // Keyboard Shortcuts listener (Ctrl+Z, Ctrl+Shift+Z / Cmd+Z, Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && !isInput) {
        if (e.shiftKey && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          redo();
        } else if (!e.shiftKey && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          undo();
        } else if (!e.shiftKey && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Wrapped change handlers to record removals
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const hasRemove = changes.some((c) => c.type === 'remove');
      if (hasRemove) {
        takeSnapshot();
      }
      onNodesChange(changes);
    },
    [onNodesChange, takeSnapshot]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const hasRemove = changes.some((c) => c.type === 'remove');
      if (hasRemove) {
        takeSnapshot();
      }
      onEdgesChange(changes);
    },
    [onEdgesChange, takeSnapshot]
  );

  // Drag start/stop for node movement undo
  const onNodeDragStart = useCallback(() => {
    dragStartSnapshotRef.current = {
      nodes: JSON.parse(JSON.stringify(nodesRef.current)),
      edges: JSON.parse(JSON.stringify(edgesRef.current)),
    };
  }, []);

  const onNodeDragStop = useCallback(() => {
    if (dragStartSnapshotRef.current) {
      const snapshot = dragStartSnapshotRef.current;
      dragStartSnapshotRef.current = null;

      pastRef.current = [...pastRef.current.slice(-MAX_HISTORY + 1), snapshot];
      futureRef.current = [];
      updateUndoRedoState();
    }
  }, [updateUndoRedoState]);

  // Register CustomNode type
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Connect handles
  const onConnect = useCallback(
    (params: Connection) => {
      takeSnapshot();
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges, takeSnapshot]
  );

  // Attach comment callbacks & comments array to node data for rendering
  const nodesWithData = useMemo(() => {
    return nodes.map((node) => {
      const nodeComments = allComments.filter((c) => c.nodeId === node.id);
      return {
        ...node,
        data: {
          ...node.data,
          comments: nodeComments,
          onOpenComments: (nodeId: string) => {
            setSelectedNodeId(nodeId);
            setShowCommentsDrawer(false);
            setShowContextoDrawer(false);
          },
        },
      };
    });
  }, [nodes, allComments]);

  // Selected Node
  const selectedNode = useMemo(() => {
    return nodesWithData.find((n) => n.id === selectedNodeId) || null;
  }, [nodesWithData, selectedNodeId]);

  // Add node from palette (Click or Drag-and-Drop)
  const handleAddNodeFromPalette = useCallback(
    (item: any, positionOverride?: { x: number; y: number }) => {
      takeSnapshot();
      const id = `node-${Date.now()}`;
      const position = positionOverride || {
        x: Math.random() * 300 + 200,
        y: Math.random() * 300 + 100,
      };

      const newNode: Node = {
        id,
        type: 'customNode',
        position,
        data: {
          label: item.label,
          description: item.description,
          type: item.type,
          category: item.category,
          iconName: item.iconName,
          color: item.color,
          isIntegration: item.isIntegration,
          options: item.defaultOptions || (item.type === 'eval_response' ? ['Opción 1', 'Opción 2', 'Otro'] : undefined),
          fieldName: item.type === 'save_field' ? 'campo_variable' : undefined,
          fieldScope: item.type === 'save_field' ? 'permanent' : undefined,
          systemName: item.isIntegration ? item.label : undefined,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(id);
    },
    [setNodes, takeSnapshot]
  );

  // Drag and Drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      const item = JSON.parse(rawData);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      handleAddNodeFromPalette(item, position);
    },
    [reactFlowInstance, handleAddNodeFromPalette]
  );

  // Node selection on canvas click
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Update node properties in state
  const handleUpdateNode = useCallback(
    (nodeId: string, updatedFields: any) => {
      if (!isEditingRef.current) {
        takeSnapshot();
        isEditingRef.current = true;
      }

      if (editTimerRef.current) clearTimeout(editTimerRef.current);
      editTimerRef.current = setTimeout(() => {
        isEditingRef.current = false;
      }, 800);

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                ...updatedFields,
              },
            };
          }
          return n;
        })
      );
    },
    [setNodes, takeSnapshot]
  );

  // Add Comment
  const handleAddComment = useCallback(
    (nodeId: string, text: string, author: string) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      const computedTitle =
        (targetNode?.data?.label as string) ||
        (nodeId === 'general' ? 'Flujo General' : `Nodo ${nodeId}`);

      const newComment: NodeComment = {
        id: `comm-${Date.now()}`,
        nodeId,
        nodeTitle: computedTitle,
        author,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAllComments((prev) => [...prev, newComment]);
    },
    [nodes]
  );

  // Delete Comment
  const handleDeleteComment = useCallback((commentId: string) => {
    setAllComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  // SAVE VERSION (Creates new version vX+1, never overwrites!)
  const handleSaveVersion = useCallback(() => {
    const nextVerNum = (project.versions.length || 0) + 1;
    const newVersionObj: ProjectVersion = {
      versionNumber: nextVerNum,
      versionLabel: `v${nextVerNum}`,
      createdAt: new Date().toISOString(),
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: {
          label: n.data.label,
          description: n.data.description,
          type: n.data.type,
          category: n.data.category,
          iconName: n.data.iconName,
          color: n.data.color,
          isIntegration: n.data.isIntegration,
          options: n.data.options,
          fieldName: n.data.fieldName,
          fieldScope: n.data.fieldScope,
          systemName: n.data.systemName,
        },
      })),
      edges,
      comments: allComments,
    };

    const updatedVersions = [...project.versions, newVersionObj];
    const updatedProject: Project = {
      ...project,
      currentVersionNumber: nextVerNum,
      versions: updatedVersions,
      updatedAt: new Date().toISOString(),
    };

    setCurrentVersionNumber(nextVerNum);
    onSaveProject(updatedProject);
    showToast(`¡Versión v${nextVerNum} guardada con éxito!`);
  }, [project, nodes, edges, allComments, onSaveProject]);

  // Switch version
  const handleSwitchVersion = (vNum: number) => {
    const targetVer = project.versions.find((v) => v.versionNumber === vNum);
    if (targetVer) {
      setCurrentVersionNumber(vNum);
      setNodes(targetVer.nodes || []);
      setEdges(targetVer.edges || []);
      setAllComments(targetVer.comments || []);
      setSelectedNodeId(null);
      showToast(`Cargada versión v${vNum}`);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CANVAS HEADER BAR */}
      <header
        className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-2xs z-20"
        style={{
          borderTop: `3px solid ${project.brandColor || '#FF6600'}`,
        }}
      >
        {/* Left Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToProjects}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Volver a lista de proyectos"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {project.logo ? (
            <div className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-2xs">
              <img src={project.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-2xs"
              style={{ backgroundColor: project.brandColor || '#2563EB' }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm truncate max-w-[180px] sm:max-w-xs">
                {project.name}
              </h2>

              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0"
                style={{
                  backgroundColor: `${project.brandColor}15`,
                  color: project.brandColor || '#2563EB',
                }}
              >
                {project.industry}
              </span>
            </div>

            {/* Version dropdown */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Versión:</span>
              <select
                value={currentVersionNumber}
                onChange={(e) => handleSwitchVersion(Number(e.target.value))}
                className="text-xs bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 font-bold text-slate-800 focus:outline-none"
              >
                {project.versions.map((v) => (
                  <option key={v.versionNumber} value={v.versionNumber}>
                    v{v.versionNumber} ({new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Center Canvas Quick Stats */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{nodes.length} Pasos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>{nodes.filter((n) => n.data?.isIntegration).length} Integraciones</span>
          </div>
        </div>

        {/* Right Actions Header */}
        <div className="flex items-center gap-2">
          {/* SCREEN LANGUAGE SWITCHER (EN, SP, PT) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage('SP')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all ${
                language === 'SP'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Idioma de pantalla: Español"
            >
              <span>🇪🇸</span>
              <span>SP</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all ${
                language === 'EN'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Screen language: English"
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('PT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all ${
                language === 'PT'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Idioma da tela: Português"
            >
              <span>🇧🇷</span>
              <span>PT</span>
            </button>
          </div>

          {/* Contexto Panel Toggle Button */}
          <button
            onClick={() => {
              setShowContextoDrawer((prev) => !prev);
              setShowCommentsDrawer(false);
              setSelectedNodeId(null);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showContextoDrawer
                ? 'bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Ver información corporativa y objetivos acordados"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">{t('btnContextDrawer')}</span>
          </button>

          {/* Comments Panel Toggle Button */}
          <button
            onClick={() => {
              setShowCommentsDrawer((prev) => !prev);
              setShowContextoDrawer(false);
              setSelectedNodeId(null);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showCommentsDrawer || allComments.length > 0
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">{t('btnCommentsDrawer')}</span>
            {allComments.length > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {allComments.length}
              </span>
            )}
          </button>

          {/* Guardar versión */}
          <button
            onClick={handleSaveVersion}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            title="Guarda como una nueva versión"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{t('btnSave')}</span>
          </button>

          {/* Generar Ficha Técnica + FlowPlan Export */}
          <button
            onClick={() => setShowSpecModal(true)}
            className="px-4 py-2 bg-atom-orange hover:bg-atom-orange-hover text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            title="Ficha Técnica + Export FlowPlan"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{t('btnGenerateSpec')}</span>
          </button>
        </div>
      </header>

      {/* CANVAS MAIN BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PALETTE SIDEBAR */}
        <NodePalette
          expectedIntegrations={project.contexto?.expectedIntegrations}
          onAddNode={(item) => handleAddNodeFromPalette(item)}
        />

        {/* CENTER REACT FLOW CANVAS */}
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodesWithData}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={2}
            defaultEdgeOptions={{
              animated: true,
              style: { strokeWidth: 2, stroke: '#3B82F6' },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#CBD5E1" />
            <Controls className="!bg-white !border-slate-200 !shadow-md flex items-center">
              <ControlButton
                onClick={undo}
                disabled={!canUndo}
                title="Deshacer (Ctrl+Z)"
                className="order-first hover:!bg-slate-100 disabled:!opacity-30 disabled:!cursor-not-allowed disabled:hover:!bg-white text-slate-700 disabled:!text-slate-400"
              >
                <Undo2 className="w-4 h-4" />
              </ControlButton>
              <ControlButton
                onClick={redo}
                disabled={!canRedo}
                title="Rehacer (Ctrl+Shift+Z)"
                className="order-first hover:!bg-slate-100 disabled:!opacity-30 disabled:!cursor-not-allowed disabled:hover:!bg-white text-slate-700 disabled:!text-slate-400 border-r border-slate-200"
              >
                <Redo2 className="w-4 h-4" />
              </ControlButton>
            </Controls>
            <MiniMap
              className="!bg-white !border-slate-200 !shadow-md !rounded-xl overflow-hidden"
              nodeColor={(node: any) => node.data?.color || '#2563EB'}
            />

            {/* Quick helper badge overlay */}
            <Panel position="top-center" className="bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs text-[11px] font-semibold text-slate-600">
              Conecta nodos arrastrando desde sus extremos. Doble clic para inspeccionar.
            </Panel>
          </ReactFlow>
        </div>

        {/* RIGHT INSPECTOR PANEL (When Node Selected and drawer not explicitly overriding) */}
        {selectedNode && !showCommentsDrawer && !showContextoDrawer && (
          <NodeInspector
            node={selectedNode}
            autoFocusComments={true}
            onUpdateNode={handleUpdateNode}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onClose={() => setSelectedNodeId(null)}
          />
        )}

        {/* RIGHT CONTEXTO DRAWER */}
        {showContextoDrawer && (
          <ContextoDrawer
            projectName={project.name}
            industry={project.industry}
            brandColor={project.brandColor}
            contexto={project.contexto}
            onClose={() => setShowContextoDrawer(false)}
          />
        )}

        {/* RIGHT COMMENTS OVERVIEW DRAWER */}
        {showCommentsDrawer && (
          <CommentsDrawer
            comments={allComments}
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onAddComment={handleAddComment}
            onSelectNode={(nodeId) => {
              if (nodeId !== 'general') {
                setSelectedNodeId(nodeId);
                setShowCommentsDrawer(false);
                setShowContextoDrawer(false);
                if (reactFlowInstance) {
                  const targetN = nodes.find((n) => n.id === nodeId);
                  if (targetN) {
                    reactFlowInstance.setCenter(
                      targetN.position.x + 100,
                      targetN.position.y + 100,
                      { zoom: 1.2, duration: 800 }
                    );
                  }
                }
              } else {
                setSelectedNodeId(null);
              }
            }}
            onDeleteComment={handleDeleteComment}
            onClose={() => setShowCommentsDrawer(false)}
          />
        )}
      </div>

      {/* GENERATED TECHNICAL SPEC MODAL */}
      {showSpecModal && (
        <FichaTecnicaModal
          project={project}
          currentVersion={activeVersion}
          liveNodes={nodes}
          liveEdges={edges}
          liveComments={allComments}
          onClose={() => setShowSpecModal(false)}
        />
      )}
    </div>
  );
};
