import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, RefreshCw, FileText, Sparkles, UserCheck, GitBranch, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { convertCanvasToFlowPlan, downloadFlowPlan } from '../api/canvasToFlowPlan';

interface FichaTecnicaModalProps {
  project: any;
  currentVersion: any;
  onClose: () => void;
}

export const FichaTecnicaModal: React.FC<FichaTecnicaModalProps> = ({
  project,
  currentVersion,
  onClose,
}) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [specMarkdown, setSpecMarkdown] = useState('');
  const [warning, setWarning] = useState('');
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedClient, setCopiedClient] = useState(false);
  const [generatingFlow, setGeneratingFlow] = useState(false);
  const [flowPlanError, setFlowPlanError] = useState('');

  const fetchSpec = async () => {
    setLoading(true);
    try {
      const payload = {
        clientName: project.name,
        industry: project.industry,
        version: currentVersion.versionLabel || `v${project.currentVersionNumber}`,
        flow: {
          nodes: currentVersion.nodes || [],
          edges: currentVersion.edges || [],
          comments: currentVersion.comments || [],
        },
      };

      const res = await fetch('/api/generate-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.specMarkdown) {
        setSpecMarkdown(data.specMarkdown);
      } else {
        setSpecMarkdown('# Error al generar la Ficha Técnica');
      }
      if (data.warning) setWarning(data.warning);
    } catch (err: any) {
      console.error(err);
      setSpecMarkdown('# Error en la comunicación con el servidor');
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

  const handleCopyClientSummary = () => {
    // Extract section 7: "Resumen de acuerdos para el cliente"
    const sectionMarker = '## 7. Resumen de acuerdos para el cliente';
    let clientText = specMarkdown;
    if (specMarkdown.includes(sectionMarker)) {
      clientText = specMarkdown.split(sectionMarker)[1]?.trim() || specMarkdown;
    }
    navigator.clipboard.writeText(clientText);
    setCopiedClient(true);
    setTimeout(() => setCopiedClient(false), 2500);
  };

  const handleDownloadJSON = () => {
    const rawData = {
      project: {
        id: project.id,
        name: project.name,
        industry: project.industry,
        brandColor: project.brandColor,
        version: currentVersion.versionLabel,
      },
      flow: {
        nodes: currentVersion.nodes,
        edges: currentVersion.edges,
        comments: currentVersion.comments,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha-tecnica-${project.name.toLowerCase().replace(/\s+/g, '-')}-${currentVersion.versionLabel || 'v1'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateFlowPlan = async () => {
    setGeneratingFlow(true);
    setFlowPlanError('');
    try {
      const canvasData = {
        project: {
          id: project.id,
          name: project.name,
          industry: project.industry,
          brandColor: project.brandColor,
          version: currentVersion.versionLabel,
        },
        nodes: currentVersion.nodes || [],
        edges: currentVersion.edges || [],
        comments: currentVersion.comments || [],
      };

      // Convert in-browser — no server, no Python needed
      const flowPlan = convertCanvasToFlowPlan(canvasData);
      const safeName = project.name || 'proyecto';
      downloadFlowPlan(flowPlan, `${safeName}-v${project.currentVersionNumber}`);

      setFlowPlanError('');
    } catch (err: any) {
      console.error(err);
      setFlowPlanError(err.message || 'Error al generar');
    } finally {
      setGeneratingFlow(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div
          className="p-5 border-b border-slate-200 flex items-center justify-between"
          style={{ backgroundColor: `${project.brandColor}10` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md font-bold text-lg"
              style={{ backgroundColor: project.brandColor || '#2563EB' }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {t('ficha.title')}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                  {currentVersion.versionLabel || 'v1'}
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

        {/* Action Toolbar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFull}
              disabled={loading}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedFull ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedFull ? '�' : 'Copiar ficha técnica (Markdown)'}
            </button>

            <button
              onClick={handleCopyClientSummary}
              disabled={loading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedClient ? <Check className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {copiedClient ? '�' : ''}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateFlowPlan}
              disabled={loading || generatingFlow}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {generatingFlow ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
              {generatingFlow ? '' : ''}
            </button>

            <button
              onClick={handleDownloadJSON}
              disabled={loading}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              
            </button>

            <button
              onClick={fetchSpec}
              disabled={loading}
              className="p-2 border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center transition-colors"
              title=" con IA"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Warning banner if any */}
        {warning && (
          <div className="bg-amber-50 text-amber-800 text-xs px-5 py-2 border-b border-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{warning}</span>
          </div>
        )}

        {/* FlowBuilder error banner */}
        {flowPlanError && (
          <div className="bg-red-50 text-red-700 text-xs px-5 py-2 border-b border-red-200 flex items-center gap-2">
            <X className="w-4 h-4 text-red-500 shrink-0" />
            <span>FlowBuilder: {flowPlanError}</span>
          </div>
        )}

        {/* FlowBuilder success banner */}
        {!generatingFlow && flowPlanError === '' && copiedFull === false && (
          <div className="bg-orange-50 text-orange-700 text-xs px-5 py-2 border-b border-orange-200 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-orange-500 shrink-0" />
            <span></span>
          </div>
        )}

        {/* Document content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-base">
                  Generando Ficha Técnica con Inteligencia Artificial...
                </p>
                <p className="text-xs text-slate-500">
                  
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
