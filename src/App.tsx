import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, Edge, Node, BackgroundVariant } from '@xyflow/react';
import { NodeType, WhatsAppNodeData, ProjectMetadata } from './types';
import { useLanguage } from './i18n';
import { CustomWhatsAppNode } from './components/CustomWhatsAppNode';
import { SidebarNodePalette } from './components/SidebarNodePalette';
import { NodeInspector } from './components/NodeInspector';
import { FlowPlanExportModal } from './components/FlowPlanExportModal';

const STORAGE_KEY = 'atom_onboarding_state';
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

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WhatsAppNodeData>>(state?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(state?.edges || []);
  const [projectMeta, setProjectMeta] = useState<ProjectMetadata>(state?.meta || { name: 'Proyecto Demo', clientName: 'Cliente Demo', description: '', industry: 'Automotriz', objective: '', author: '' });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  const nodeTypes = useMemo(() => ({ customWhatsAppNode: CustomWhatsAppNode }), []);
  const onConnect = useCallback((p: Connection) => setEdges(eds => addEdge(p, eds)), [setEdges]);
  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  const handleAddNode = useCallback((type: NodeType) => {
    const id = `n_${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type: 'customWhatsAppNode',
      position: { x: 300 + (nds.length % 3) * 350, y: 150 + Math.floor(nds.length / 3) * 250 },
      data: { nodeType: type, label: getLabel(type, t), description: '', options: (type === 'eval_response' || type === 'smarton') ? ['Opción 1', 'Opción 2'] : undefined, fieldName: (type === 'save_field' || type === 'customer_stage') ? 'var_campo' : undefined },
    }]);
  }, [setNodes, t]);

  const handleUpdateNode = useCallback((id: string, d: Partial<WhatsAppNodeData>) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...d } } : n));
  }, [setNodes]);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  // Auto-save
  useEffect(() => {
    const t = setTimeout(() => saveState(nodes, edges, projectMeta), 2000);
    return () => clearTimeout(t);
  }, [nodes, edges, projectMeta]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--atom-light)] font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Minimal header */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950 shrink-0">
        <h1 className="text-sm font-extrabold text-slate-900 dark:text-white">ATOM Canvas Demo</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{nodes.length} nodos</span>
          <button onClick={() => { setNodes([]); setEdges([]); }} className="text-xs text-slate-400 hover:text-red-500">Limpiar</button>
          <button onClick={() => setShowExport(true)} className="rounded-lg bg-[var(--atom-orange)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#e55a00]">Exportar</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <SidebarNodePalette onAddNode={handleAddNode} />
        <main className="relative flex-1 bg-[var(--atom-light)] dark:bg-slate-900">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-slate-400"><div className="text-5xl mb-4">🖱️</div><p className="text-lg font-semibold">Haz clic en los componentes de la izquierda</p></div>
            </div>
          )}
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={(_, n) => setSelectedNodeId(n.id)} onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes} fitView deleteKeyCode={['Backspace','Delete']}
            defaultEdgeOptions={{ type: 'smoothstep', animated: true, style: { stroke: '#FF6600', strokeWidth: 2 } }}>
            <Controls className="!border-slate-200 !bg-white !shadow-md" />
            <MiniMap zoomable pannable className="!border-slate-200 !bg-white !shadow-md" />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          </ReactFlow>
        </main>
        {selectedNode && <NodeInspector selectedNode={selectedNode} onUpdateNodeData={handleUpdateNode} onDeleteNode={handleDeleteNode} onClose={() => setSelectedNodeId(null)} />}
      </div>
      <FlowPlanExportModal isOpen={showExport} onClose={() => setShowExport(false)} nodes={nodes} edges={edges} projectMeta={projectMeta} />
    </div>
  );
}
