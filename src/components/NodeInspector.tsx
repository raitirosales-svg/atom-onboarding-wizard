import React from 'react';
import { Node } from '@xyflow/react';
import { WhatsAppNodeData } from '../types';
import { Trash2, Plus, X, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../i18n';

interface NodeInspectorProps {
  selectedNode: Node<WhatsAppNodeData> | null;
  onUpdateNodeData: (id: string, newPartialData: Partial<WhatsAppNodeData>) => void;
  onDeleteNode: (id: string) => void;
  onClose: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!selectedNode) return null;

  const data = selectedNode.data;
  const nodeType = data.nodeType || 'message';

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(data.options || [])];
    newOptions[index] = value;
    onUpdateNodeData(selectedNode.id, { options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(data.options || []), `Opción ${(data.options?.length || 0) + 1}`];
    onUpdateNodeData(selectedNode.id, { options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = (data.options || []).filter((_, i) => i !== index);
    onUpdateNodeData(selectedNode.id, { options: newOptions });
  };

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--atom-orange)] dark:text-orange-400" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {t('inspectorTitle')}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Node Label */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300">
            {t('nodeTitleInput')}:
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onUpdateNodeData(selectedNode.id, { label: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>

        {/* Description / Message Text */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300">
            {t('nodeDescInput')}:
          </label>
          <textarea
            rows={4}
            value={data.description || ''}
            onChange={(e) => onUpdateNodeData(selectedNode.id, { description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>

        {/* Specific Attributes for Save Field */}
        {(nodeType === 'save_field' || nodeType === 'customer_stage') && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              {t('fieldNameLabel')}:
            </label>
            <input
              type="text"
              value={data.fieldName || ''}
              onChange={(e) => onUpdateNodeData(selectedNode.id, { fieldName: e.target.value })}
              placeholder="ej: var_nombre_cliente"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
        )}

        {/* Options for Eval Response or Smarton */}
        {(nodeType === 'eval_response' || nodeType === 'smarton') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {t('buttonOptionsLabel')}:
              </label>
              <button
                onClick={handleAddOption}
                className="flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700 hover:bg-orange-100 dark:bg-orange-950/60 dark:text-orange-300"
              >
                <Plus className="h-3 w-3" /> {t('addOptionBtn')}
              </button>
            </div>
            {(data.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                />
                <button
                  onClick={() => handleRemoveOption(idx)}
                  className="rounded p-1 text-slate-400 hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Prompt for Smarton */}
        {nodeType === 'smarton' && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              System Prompt:
            </label>
            <textarea
              rows={4}
              value={data.prompt || ''}
              onChange={(e) => onUpdateNodeData(selectedNode.id, { prompt: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-[11px] focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
        )}

        {/* Delay Minutes */}
        {nodeType === 'delay' && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Delay (Min):
            </label>
            <input
              type="number"
              value={data.delayMinutes || 5}
              onChange={(e) =>
                onUpdateNodeData(selectedNode.id, { delayMinutes: parseInt(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
        )}

        {/* HTTP / CRM Settings */}
        {nodeType === 'crm' && (
          <>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                CRM System:
              </label>
              <input
                type="text"
                value={data.systemName || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { systemName: e.target.value })}
                placeholder="ej: Salesforce / HubSpot / Shopify"
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                HTTP Method:
              </label>
              <select
                value={data.method || 'GET'}
                onChange={(e) =>
                  onUpdateNodeData(selectedNode.id, { method: e.target.value as any })
                }
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                URL Endpoint:
              </label>
              <input
                type="text"
                value={data.url || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { url: e.target.value })}
                placeholder="https://api.empresa.com/v1/lead"
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-[11px] focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>
          </>
        )}

        {/* Assign Group */}
        {nodeType === 'assign_group' && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Agent Group:
            </label>
            <input
              type="text"
              value={data.systemName || ''}
              onChange={(e) => onUpdateNodeData(selectedNode.id, { systemName: e.target.value })}
              placeholder="ej: Equipo_Ventas_Tech"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
        )}
      </div>

      {/* Footer Delete Button */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-rose-50 py-2 font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition-colors"
        >
          <Trash2 className="h-4 w-4" /> {t('deleteNodeBtn')}
        </button>
      </div>
    </div>
  );
};

