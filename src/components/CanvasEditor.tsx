import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useI18n } from '../i18n';
import type { Language } from '../i18n';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
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
} from 'lucide-react';

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
  const { t, lang, setLang } = useI18n();
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
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Register CustomNode type
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Connect handles
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges]
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
          systemName: item.isIntegration ? item.label : undefined,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(id);
    },
    [setNodes]
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
    [setNodes]
  );

  // Add Comment
  const handleAddComment = useCallback(
    (nodeId: string, text: string, author: string) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      const newComment: NodeComment = {
        id: `comm-${Date.now()}`,
        nodeId,
        nodeTitle: (targetNode?.data?.label as string) || `Nodo ${nodeId}`,
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
          borderTop: `3px solid ${project.brandColor || '#2563EB'}`,
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

            {/* Language selector */}
            <div className="flex items-center gap-1 mt-1">
              {(['es', 'en', 'pt'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                    lang === l
                      ? 'bg-atom-orange text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {l === 'es' ? 'ES' : l === 'en' ? 'EN' : 'PT'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas Quick Stats */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-atom-orange" />
            <span>{nodes.length} {t('canvas.steps')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>{nodes.filter((n) => n.data?.isIntegration).length} {t('canvas.integrations_count')}</span>
          </div>
        </div>

        {/* Right Actions Header */}
        <div className="flex items-center gap-2">
          {/* Comments Panel Toggle Button */}
          <button
            onClick={() => {
              setShowCommentsDrawer((prev) => !prev);
              setSelectedNodeId(null);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showCommentsDrawer || allComments.length > 0
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Comentarios</span>
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
            title="Guarda como una nueva versión en localStorage"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Guardar versión</span>
          </button>

          {/* Generar Ficha Técnica */}
          <button
            onClick={() => setShowSpecModal(true)}
            className="px-4 py-2 bg-atom-orange hover:bg-atom-orange-hover text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('canvas.spec')}</span>
          </button>
        </div>
      </header>

      {/* CANVAS MAIN BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PALETTE SIDEBAR */}
        <NodePalette onAddNode={(item) => handleAddNodeFromPalette(item)} />

        {/* CENTER REACT FLOW CANVAS */}
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodesWithData}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
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
            <Controls className="!bg-white !border-slate-200 !shadow-md" />
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

        {/* RIGHT INSPECTOR PANEL (When Node Selected) */}
        {selectedNode && (
          <NodeInspector
            node={selectedNode}
            onUpdateNode={handleUpdateNode}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onClose={() => setSelectedNodeId(null)}
          />
        )}

        {/* RIGHT COMMENTS OVERVIEW DRAWER */}
        {showCommentsDrawer && !selectedNode && (
          <CommentsDrawer
            comments={allComments}
            onSelectNode={(nodeId) => {
              setSelectedNodeId(nodeId);
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
          onClose={() => setShowSpecModal(false)}
        />
      )}
    </div>
  );
};
