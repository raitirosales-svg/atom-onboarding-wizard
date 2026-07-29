import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
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

const initialProjectMeta: ProjectMetadata = {
  name: 'Chatbot Atom Commerce & Support',
  clientName: 'Atom Retail Solutions',
  description: 'Flujo multicanal con atención al cliente, menú interactivo y derivación a CRM.',
  industry: 'Retail & Ecommerce',
  objective: 'Reducir el tiempo de respuesta inicial en WhatsApp e incrementar ventas automatizadas.',
  author: 'Atom Solutions Architect',
};

const defaultTemplate = PREBUILT_TEMPLATES[0];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WhatsAppNodeData>>(
    defaultTemplate.nodes as Node<WhatsAppNodeData>[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(defaultTemplate.edges);

  const [projectMeta, setProjectMeta] = useState<ProjectMetadata>(
    defaultTemplate.projectMeta || initialProjectMeta
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modal States
  const [isFichaTecnicaOpen, setIsFichaTecnicaOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiSuggestionsOpen, setIsAiSuggestionsOpen] = useState(false);

  // Register custom node component
  const nodeTypes = useMemo(() => ({ customWhatsAppNode: CustomWhatsAppNode }), []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const id = `node-${Date.now()}`;
      const newNode: Node<WhatsAppNodeData> = {
        id,
        type: 'customWhatsAppNode',
        position: {
          x: 250 + (nodes.length % 5) * 40,
          y: 150 + (nodes.length % 5) * 40,
        },
        data: {
          nodeType: type,
          label: getInitialLabel(type),
          description: getInitialDescription(type),
          options: type === 'eval_response' || type === 'smarton' ? ['Opción 1', 'Opción 2'] : undefined,
          fieldName: type === 'save_field' || type === 'customer_stage' ? 'var_campo' : undefined,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
    },
    [nodes.length, setNodes]
  );

  const handleUpdateNodeData = useCallback(
    (id: string, newPartialData: Partial<WhatsAppNodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newPartialData,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      if (selectedNodeId === id) setSelectedNodeId(null);
    },
    [selectedNodeId, setNodes, setEdges]
  );

  const handleLoadTemplate = useCallback(
    (templateId: string) => {
      const tmpl = PREBUILT_TEMPLATES.find((t) => t.id === templateId);
      if (tmpl) {
        setNodes(tmpl.nodes as Node<WhatsAppNodeData>[]);
        setEdges(tmpl.edges);
        setProjectMeta(tmpl.projectMeta);
        setSelectedNodeId(null);
      }
    },
    [setNodes, setEdges]
  );

  const handleApplyGeneratedFlow = useCallback(
    (newNodes: Node<WhatsAppNodeData>[], newEdges: Edge[]) => {
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNodeId(null);
    },
    [setNodes, setEdges]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--atom-light)] font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navigation Header */}
      <Header
        projectMeta={projectMeta}
        onUpdateProjectMeta={setProjectMeta}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        onOpenFichaTecnica={() => setIsFichaTecnicaOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAiSuggestions={() => setIsAiSuggestionsOpen(true)}
      />

      {/* Main Workspace (Palette + ReactFlow Canvas + Inspector) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Palette */}
        <SidebarNodePalette
          onAddNode={handleAddNode}
          projectMeta={projectMeta}
          onUpdateProjectMeta={setProjectMeta}
          onLoadTemplate={handleLoadTemplate}
        />

        {/* Center Flow Canvas */}
        <main className="relative flex-1 bg-[var(--atom-light)] dark:bg-slate-900">
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
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#FF6600', strokeWidth: 2 },
            }}
          >
            <Controls className="!border-slate-200 !bg-white !shadow-md dark:!border-slate-800 dark:!bg-slate-900" />
            <MiniMap
              zoomable
              pannable
              className="!border-slate-200 !bg-white !shadow-md dark:!border-slate-800 dark:!bg-slate-900"
            />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          </ReactFlow>
        </main>

        {/* Right Inspector Drawer (shown when node is selected) */}
        {selectedNode && (
          <NodeInspector
            selectedNode={selectedNode}
            onUpdateNodeData={handleUpdateNodeData}
            onDeleteNode={handleDeleteNode}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      {/* Modals */}
      <FichaTecnicaModal
        isOpen={isFichaTecnicaOpen}
        onClose={() => setIsFichaTecnicaOpen(false)}
        projectMeta={projectMeta}
        nodes={nodes}
        edges={edges}
      />

      <WhatsAppSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        nodes={nodes}
        edges={edges}
      />

      <FlowPlanExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        nodes={nodes}
        edges={edges}
        projectMeta={projectMeta}
      />

      <AiAssistantModal
        isOpen={isAiSuggestionsOpen}
        onClose={() => setIsAiSuggestionsOpen(false)}
        nodes={nodes}
        edges={edges}
        projectMeta={projectMeta}
        onApplyGeneratedFlow={handleApplyGeneratedFlow}
      />
    </div>
  );
}

function getInitialLabel(type: NodeType): string {
  switch (type) {
    case 'message':
      return 'Mensaje de Texto';
    case 'template':
      return 'Plantilla WhatsApp';
    case 'eval_response':
      return 'Evaluar Botones';
    case 'condition':
      return 'Condicional';
    case 'jump':
      return 'Salto Flujo';
    case 'typification':
      return 'Cierre Ticket';
    case 'delay':
      return 'Espera Temporal';
    case 'save_field':
      return 'Guardar Campo';
    case 'smarton':
      return 'Smarton AI Assistant';
    case 'format':
      return 'Formatear Dato';
    case 'tag':
      return 'Etiquetar Contacto';
    case 'customer_stage':
      return 'Etapa del Funnel';
    case 'assign_group':
      return 'Asignar Agente';
    case 'crm':
      return 'Consulta HTTP/CRM';
    default:
      return 'Nuevo Nodo';
  }
}

function getInitialDescription(type: NodeType): string {
  switch (type) {
    case 'message':
      return '¡Hola! Gracias por comunicarte con nosotros.';
    case 'eval_response':
      return 'Por favor selecciona una de las siguientes opciones:';
    case 'smarton':
      return 'Asistente IA para resolver preguntas frecuentes del cliente.';
    case 'save_field':
      return 'Ingrese el valor que desea guardar.';
    case 'crm':
      return 'Obtener datos de API externa.';
    default:
      return '';
  }
}
