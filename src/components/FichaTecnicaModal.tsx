import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, RefreshCw, FileText, Sparkles, UserCheck } from 'lucide-react';
import { generateFallbackSpec } from '../lib/generateFallbackSpec';
import { canvasToFlowPlan, downloadJson } from '../lib/canvasToFlowPlan';

interface FichaTecnicaModalProps {
  project: any;
  currentVersion: any;
  liveNodes?: any[];
  liveEdges?: any[];
  liveComments?: any[];
  onClose: () => void;
}

export const FichaTecnicaModal: React.FC<FichaTecnicaModalProps> = ({
  project,
  currentVersion,
  liveNodes,
  liveEdges,
  liveComments,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [specMarkdown, setSpecMarkdown] = useState('');
  const [warning, setWarning] = useState('');
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedClient, setCopiedClient] = useState(false);

  const nodes = liveNodes ?? currentVersion.nodes ?? [];
  const edges = liveEdges ?? currentVersion.edges ?? [];
  const comments = liveComments ?? currentVersion.comments ?? [];

  const buildPayload = () => ({
    clientName: project.name,
    industry: project.industry,
    version: currentVersion.versionLabel || `v${project.currentVersionNumber}`,
    contexto: project.contexto,
    flow: {
      nodes,
      edges,
      comments,
    },
  });

  const fetchSpec = async () => {
    setLoading(true);
    setWarning('');
    const payload = buildPayload();

    try {
      const res = await fetch('/api/generate-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.specMarkdown) {
        setSpecMarkdown(data.specMarkdown);
      } else {
        setSpecMarkdown(generateFallbackSpec(payload));
        setWarning('Respuesta incompleta del servidor. Se usó motor local.');
      }
      if (data.warning) setWarning(data.warning);
    } catch {
      setSpecMarkdown(generateFallbackSpec(payload));
      setWarning(
        'API no disponible (GitHub Pages / sin servidor). Ficha generada localmente con el motor estructurado.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpec();
  }, []);

  const handleCopyFull = () => {
    navigator.clipboard.writeText(specMarkdown);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const extractClientSummary = (md: string) => {
    const markers = [
      '## 8. Resumen de Acuerdos para el Cliente',
      '## 8. Resumen de acuerdos para el cliente',
      '## 7. Resumen de acuerdos para el cliente',
      '## 7. Resumen de Acuerdos para el Cliente',
    ];
    for (const marker of markers) {
      if (md.includes(marker)) {
        return md.split(marker)[1]?.trim() || md;
      }
    }
    return md;
  };

  const handleCopyClientSummary = () => {
    const clientText = extractClientSummary(specMarkdown);
    navigator.clipboard.writeText(clientText);
    setCopiedClient(true);
    setTimeout(() => setCopiedClient(false), 2500);
  };

  const slug = project.name.toLowerCase().replace(/\s+/g, '-');
  const ver = currentVersion.versionLabel || 'v1';

  const handleDownloadJSON = () => {
    downloadJson(`ficha-tecnica-${slug}-${ver}.json`, {
      project: {
        id: project.id,
        name: project.name,
        industry: project.industry,
        brandColor: project.brandColor,
        logo: project.logo ? '[base64 omitted in export metadata]' : undefined,
        version: ver,
        contexto: project.contexto,
      },
      flow: { nodes, edges, comments },
      exportedAt: new Date().toISOString(),
    });
  };

  const handleDownloadFlowPlan = () => {
    if (!nodes.length) {
      alert('El canvas está vacío. Agrega nodos antes de exportar FlowPlan.');
      return;
    }
    const plan = canvasToFlowPlan({
      nodes,
      edges,
      comments,
      contexto: project.contexto,
      project: {
        name: project.name,
        industry: project.industry,
        brandColor: project.brandColor,
      },
    });
    downloadJson(`flow_plan-${slug}-${ver}.json`, plan);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div
          className="p-5 border-b border-slate-200 flex items-center justify-between"
          style={{ backgroundColor: `${project.brandColor || '#FF6600'}10` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md font-bold text-lg"
              style={{ backgroundColor: project.brandColor || '#FF6600' }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Ficha Técnica de Implementación
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-800">
                  {ver}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Documento técnico auto-generado para {project.name} ({project.industry})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyFull}
              disabled={loading}
              className="px-3.5 py-2 bg-atom-orange hover:bg-atom-orange-hover text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedFull ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedFull ? '¡Copiado!' : 'Copiar ficha técnica (Markdown)'}
            </button>

            <button
              onClick={handleCopyClientSummary}
              disabled={loading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedClient ? <Check className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {copiedClient ? '¡Copiado!' : 'Copiar resumen para cliente'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadJSON}
              disabled={loading}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              JSON del flujo
            </button>

            <button
              onClick={handleDownloadFlowPlan}
              disabled={loading}
              className="px-3 py-2 border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-900 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              title="Exporta flow_plan.json compatible con FlowBuilder"
            >
              <Download className="w-4 h-4" />
              FlowPlan JSON
            </button>

            <button
              onClick={fetchSpec}
              disabled={loading}
              className="p-2 border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center transition-colors"
              title="Regenerar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-600' : ''}`} />
            </button>
          </div>
        </div>

        {warning && (
          <div className="bg-amber-50 text-amber-800 text-xs px-5 py-2 border-b border-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{warning}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-atom-orange border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-base">Generando Ficha Técnica...</p>
                <p className="text-xs text-slate-500">
                  Analizando estructura del flujo, nodos de integración, variables y acuerdos.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {specMarkdown}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
