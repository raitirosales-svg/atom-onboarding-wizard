import React, { useState } from 'react';
import { X, FileText, Sparkles, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { ProjectMetadata, WhatsAppNodeData } from '../types';
import { Node, Edge } from '@xyflow/react';
import { useLanguage } from '../i18n';
import { generateWithGemini } from '../utils/geminiClient';

interface FichaTecnicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectMeta: ProjectMetadata;
  nodes: Node<WhatsAppNodeData>[];
  edges: Edge[];
}

export const FichaTecnicaModal: React.FC<FichaTecnicaModalProps> = ({
  isOpen,
  onClose,
  projectMeta,
  nodes,
  edges,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [specMarkdown, setSpecMarkdown] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateSpec = async () => {
    setLoading(true);
    setError(null);

    // Build prompt for Gemini
    const nodeDescs = nodes.map((n) =>
      `- [${n.data.nodeType}] ${n.data.label}${n.data.description ? ': ' + n.data.description : ''}${n.data.options?.length ? ' (Options: ' + n.data.options.join(', ') + ')' : ''}${n.data.systemName ? ' [System: ' + n.data.systemName + ']' : ''}`
    ).join('\n');

    const prompt = `Generate a professional technical implementation spec in Spanish for a WhatsApp chatbot.

Client: ${projectMeta.name || 'Cliente'}
Industry: ${projectMeta.industry || 'No especificada'}

Flow structure (${nodes.length} nodes, ${edges.length} connections):
${nodeDescs}

Generate a markdown document with these sections:
## 1. Resumen Ejecutivo
## 2. Objetivos del Bot
## 3. Flujo Paso a Paso
## 4. Integraciones Requeridas
## 5. Datos a Capturar
## 6. Preguntas Abiertas
## 7. Resumen para el Cliente (lenguaje no técnico)`;

    try {
      // Try Express server first (AI Studio / local dev)
      let specText = '';
      try {
        const response = await fetch('/api/generate-spec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectMeta, nodes, edgesCount: edges.length }),
        });
        if (response.ok) {
          const data = await response.json();
          specText = data.specMarkdown || '';
        }
      } catch {
        // Server not available, try client-side Gemini
      }

      // Fallback to client-side Gemini
      if (!specText) {
        specText = await generateWithGemini(prompt);
      }

      setSpecMarkdown(specText);
    } catch (err: any) {
      setError(err.message || 'Hubo un inconveniente al contactar el servicio de IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!specMarkdown) return;
    navigator.clipboard.writeText(specMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!specMarkdown) return;
    const blob = new Blob([specMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ficha_Tecnica_${(projectMeta.name || 'Bot').replace(/\s+/g, '_')}.md`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[var(--atom-orange)] dark:bg-orange-950/80 dark:text-orange-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('specModalTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('specModalSubtitle')}
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

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!specMarkdown && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[var(--atom-orange)] dark:bg-orange-950/60 dark:text-orange-400">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {projectMeta.name || 'Bot'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {nodes.length} Nodos & {edges.length} Conexiones
                </p>
              </div>
              <button
                onClick={handleGenerateSpec}
                className="flex items-center gap-2 rounded-xl bg-[var(--atom-orange)] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[var(--atom-orange-hover)] transition-colors"
              >
                <Sparkles className="h-4 w-4" /> {t('specGenerateBtn')}
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-[var(--atom-orange)]" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('generatingSpecMsg')}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
          )}

          {specMarkdown && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[var(--atom-orange)]" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? t('specCopied') : t('specCopyBtn')}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <Download className="h-3.5 w-3.5" /> Descargar .md
                  </button>
                  <button
                    onClick={handleGenerateSpec}
                    className="flex items-center gap-1 rounded-lg bg-[var(--atom-orange)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--atom-orange-hover)]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> {t('specRegenerateBtn')}
                  </button>
                </div>
              </div>

              {/* Formatted Markdown Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
                {specMarkdown}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

