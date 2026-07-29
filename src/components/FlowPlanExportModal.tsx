import React, { useState } from 'react';
import { X, Copy, Check, Download, FileJson, CheckCircle } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { WhatsAppNodeData, ProjectMetadata } from '../types';
import { convertCanvasToFlowPlan } from '../utils/flowPlanExporter';
import { useLanguage } from '../i18n';

interface FlowPlanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node<WhatsAppNodeData>[];
  edges: Edge[];
  projectMeta: ProjectMetadata;
}

export const FlowPlanExportModal: React.FC<FlowPlanExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  projectMeta,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  let flowPlanObj;
  let jsonString;
  try {
    flowPlanObj = convertCanvasToFlowPlan(nodes, edges, projectMeta.name);
    jsonString = JSON.stringify(flowPlanObj, null, 2);
  } catch (e: any) {
    if (!error) setError(e.message || 'Error al generar el flow plan');
    flowPlanObj = { nodes: [], edges: [] };
    jsonString = 'Error al generar el JSON';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow_plan_${(projectMeta.name || 'bot').toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('exportTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('exportSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--atom-orange)] dark:text-orange-400">
            <CheckCircle className="h-4 w-4" />
            <span>{nodes.length === 0 ? 'No hay nodos en el canvas. Agrega al menos un nodo para exportar.' : t('exportValidityMsg', { nodes: flowPlanObj.nodes.length, edges: flowPlanObj.edges.length })}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[var(--atom-orange)]" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t('specCopied') : t('copyJsonBtn')}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--atom-orange)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--atom-orange-hover)]"
            >
              <Download className="h-3.5 w-3.5" /> {t('downloadJsonBtn')}
            </button>
          </div>
        </div>

        {/* Code Container */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              <strong>Error:</strong> {error}
              <p className="mt-1 text-xs">Asegúrate de tener al menos un nodo en el canvas y que el proyecto tenga nombre.</p>
            </div>
          )}
          <pre className="rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs text-orange-400 overflow-x-auto selection:bg-orange-950 selection:text-white">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
};

