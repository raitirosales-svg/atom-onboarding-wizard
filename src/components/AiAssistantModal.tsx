import React, { useState } from 'react';
import { X, Sparkles, Wand2, Check } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { WhatsAppNodeData, ProjectMetadata } from '../types';
import { useLanguage } from '../i18n';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node<WhatsAppNodeData>[];
  edges: Edge[];
  projectMeta: ProjectMetadata;
  onApplyGeneratedFlow: (newNodes: Node<WhatsAppNodeData>[], newEdges: Edge[]) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  projectMeta,
  onApplyGeneratedFlow,
}) => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestionText, setSuggestionText] = useState<string | null>(null);
  const [generatedFlowData, setGeneratedFlowData] = useState<{
    nodes: Node<WhatsAppNodeData>[];
    edges: Edge[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestionText(null);
    setGeneratedFlowData(null);

    try {
      const response = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: prompt,
          currentNodes: nodes.map((n) => ({
            id: n.id,
            label: n.data.label,
            nodeType: n.data.nodeType,
            description: n.data.description,
          })),
          projectMeta,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar consulta de IA');
      }

      setSuggestionText(data.suggestionText);
      if (data.generatedNodes && data.generatedNodes.length > 0) {
        setGeneratedFlowData({
          nodes: data.generatedNodes,
          edges: data.generatedEdges || [],
        });
      }
    } catch (err: any) {
      setError(err.message || 'Error al comunicar con el asistente Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedFlowData) {
      onApplyGeneratedFlow(generatedFlowData.nodes, generatedFlowData.edges);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[var(--atom-orange)] dark:bg-orange-950/80 dark:text-orange-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('aiAssistantTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('aiAssistantSubtitle')}
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

        {/* Input & Presets */}
        <div className="border-b border-slate-100 p-6 space-y-3 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('aiAssistantPlaceholder')}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 rounded-xl bg-[var(--atom-orange)] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[var(--atom-orange-hover)] disabled:opacity-50 transition-colors"
            >
              <Wand2 className="h-4 w-4" /> {t('aiAssistantGenerateBtn')}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <Sparkles className="h-7 w-7 animate-spin text-purple-600" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('aiAssistantThinking')}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
          )}

          {suggestionText && !loading && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900/40 dark:bg-purple-950/30">
                <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-1">
                  Recomendaciones del Asistente:
                </h4>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {suggestionText}
                </p>
              </div>

              {generatedFlowData && (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/50">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                    Se generó una estructura con {generatedFlowData.nodes.length} nuevos nodos.
                  </span>
                  <button
                    onClick={handleApply}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4" /> {t('aiAssistantApplyBtn')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

