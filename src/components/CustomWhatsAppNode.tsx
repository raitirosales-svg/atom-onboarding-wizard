import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  MessageSquare,
  FileText,
  MousePointerClick,
  GitBranch,
  CornerDownRight,
  CheckCircle2,
  Clock,
  Database,
  Sparkles,
  Type,
  Tag,
  Kanban,
  Users,
  Globe,
  Trash2,
  Copy,
} from 'lucide-react';
import { WhatsAppNodeData, NodeType } from '../types';
import { useLanguage } from '../i18n';

interface NodeStyleConfig {
  icon: React.ElementType;
  label: string;
  badgeBg: string;
  borderColor: string;
  headerBg: string;
  textColor: string;
}

const NODE_CONFIGS: Record<NodeType, NodeStyleConfig> = {
  message: {
    icon: MessageSquare,
    label: 'Mensaje de Texto',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-300 dark:border-blue-700',
    headerBg: 'bg-blue-50 dark:bg-blue-950/40',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  template: {
    icon: FileText,
    label: 'Plantilla WhatsApp (HSM)',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-300 dark:border-teal-700',
    headerBg: 'bg-teal-50 dark:bg-teal-950/40',
    textColor: 'text-teal-600 dark:text-teal-400',
  },
  eval_response: {
    icon: MousePointerClick,
    label: 'Evaluar Botones',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  condition: {
    icon: GitBranch,
    label: 'Condicional (If/Else)',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-300 dark:border-amber-700',
    headerBg: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  jump: {
    icon: CornerDownRight,
    label: 'Salto / Jump',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-300 dark:border-purple-700',
    headerBg: 'bg-purple-50 dark:bg-purple-950/40',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  typification: {
    icon: CheckCircle2,
    label: 'Tipificación / Cierre',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-300 dark:border-slate-600',
    headerBg: 'bg-slate-50 dark:bg-slate-900/50',
    textColor: 'text-slate-600 dark:text-slate-400',
  },
  delay: {
    icon: Clock,
    label: 'Espera / Delay',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-300 dark:border-sky-700',
    headerBg: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-600 dark:text-sky-400',
  },
  save_field: {
    icon: Database,
    label: 'Guardar Campo',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-300 dark:border-indigo-700',
    headerBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    textColor: 'text-indigo-600 dark:text-indigo-400',
  },
  smarton: {
    icon: Sparkles,
    label: 'Smarton AI Assistant',
    badgeBg: 'bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-700 dark:text-fuchsia-300',
    borderColor: 'border-fuchsia-300 dark:border-fuchsia-700',
    headerBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  format: {
    icon: Type,
    label: 'Formateador Texto',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300',
    borderColor: 'border-cyan-300 dark:border-cyan-700',
    headerBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    textColor: 'text-cyan-600 dark:text-cyan-400',
  },
  tag: {
    icon: Tag,
    label: 'Etiquetar Contacto',
    badgeBg: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300',
    borderColor: 'border-violet-300 dark:border-violet-700',
    headerBg: 'bg-violet-50 dark:bg-violet-950/40',
    textColor: 'text-violet-600 dark:text-violet-400',
  },
  customer_stage: {
    icon: Kanban,
    label: 'Etapa del Cliente',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-300 dark:border-rose-700',
    headerBg: 'bg-rose-50 dark:bg-rose-950/40',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
  assign_group: {
    icon: Users,
    label: 'Asignar Asesor/Grupo',
    badgeBg: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-300 dark:border-orange-700',
    headerBg: 'bg-orange-50 dark:bg-orange-950/40',
    textColor: 'text-orange-600 dark:text-orange-400',
  },
  crm: {
    icon: Globe,
    label: 'Integración HTTP / CRM',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
};

export const CustomWhatsAppNode = memo(({ id, data, selected }: NodeProps) => {
  const { t } = useLanguage();
  const nodeData = data as WhatsAppNodeData;
  const nodeType = nodeData.nodeType || 'message';
  const styleConfig = NODE_CONFIGS[nodeType] || NODE_CONFIGS.message;
  const IconComponent = styleConfig.icon;

  const options = nodeData.options || ['Opción 1', 'Opción 2'];

  return (
    <div
      className={`group relative w-72 rounded-xl border bg-white shadow-md transition-all dark:bg-slate-900 ${
        styleConfig.borderColor
      } ${selected ? 'ring-2 ring-[var(--atom-orange)] ring-offset-2 dark:ring-offset-slate-900' : 'hover:shadow-lg'}`}
    >
      {/* Target handle (Input from parent) */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!h-3.5 !w-3.5 !border-2 !border-white !bg-slate-600 hover:!bg-[var(--atom-orange)] dark:!border-slate-900"
      />

      {/* Header */}
      <div
        className={`flex items-center justify-between rounded-t-xl px-3.5 py-2.5 ${styleConfig.headerBg}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <IconComponent className={`h-4 w-4 shrink-0 ${styleConfig.textColor}`} />
          <span className="truncate text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            {nodeData.label || styleConfig.label}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${styleConfig.badgeBg}`}
        >
          {nodeType.replace('_', ' ')}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-3 text-xs text-slate-600 dark:text-slate-300">
        {nodeData.description && (
          <p className="line-clamp-3 rounded bg-slate-50 p-2 italic text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            "{nodeData.description}"
          </p>
        )}

        {/* Specific Type Attributes Preview */}
        {nodeType === 'save_field' && nodeData.fieldName && (
          <div className="mt-2 flex items-center justify-between rounded border border-indigo-200 bg-indigo-50/50 px-2 py-1 dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <span className="font-mono text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
              Campo: ${nodeData.fieldName}
            </span>
          </div>
        )}

        {nodeType === 'crm' && (
          <div className="mt-2 space-y-1 rounded border border-slate-200 bg-slate-50 p-2 font-mono text-[10px] dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {nodeData.method || 'GET'}
              </span>
              <span className="text-slate-500">{nodeData.systemName || 'API'}</span>
            </div>
            <p className="truncate text-slate-500">{nodeData.url || 'https://...'}</p>
          </div>
        )}

        {nodeType === 'delay' && (
          <div className="mt-2 flex items-center gap-1.5 text-sky-700 dark:text-sky-300">
            <Clock className="h-3.5 w-3.5" />
            <span>Esperar {nodeData.delayMinutes || 5} minutos</span>
          </div>
        )}

        {/* Outputs / Source Handles */}
        {nodeType === 'eval_response' && (
          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">
              Opciones de Botón:
            </div>
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-between rounded border border-emerald-200 bg-emerald-50/70 py-1 pl-2 pr-4 text-[11px] font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                <span className="truncate">{opt}</span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`button_${idx}`}
                  style={{ top: `${28 + idx * 28}px`, right: '-14px' }}
                  className="!h-3 !w-3 !border-2 !border-white !bg-emerald-500 dark:!border-slate-900"
                />
              </div>
            ))}
            <div className="relative flex items-center justify-between py-0.5 text-[10px] text-slate-400">
              <span>Sin respuesta (Timeout)</span>
              <Handle
                type="source"
                position={Position.Right}
                id="no_answer"
                className="!h-2.5 !w-2.5 !border-2 !border-white !bg-amber-500 dark:!border-slate-900"
              />
            </div>
          </div>
        )}

        {nodeType === 'smarton' && (
          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800">
            <div className="text-[10px] font-semibold text-fuchsia-500 uppercase">
              Intenciones Detectadas:
            </div>
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-between rounded border border-fuchsia-200 bg-fuchsia-50/70 py-1 pl-2 pr-4 text-[11px] font-medium text-fuchsia-800 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/40 dark:text-fuchsia-200"
              >
                <span className="truncate">{opt}</span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`intent_${idx}`}
                  style={{ top: `${28 + idx * 28}px`, right: '-14px' }}
                  className="!h-3 !w-3 !border-2 !border-white !bg-fuchsia-500 dark:!border-slate-900"
                />
              </div>
            ))}
          </div>
        )}

        {nodeType === 'crm' && (
          <div className="mt-3 space-y-1 border-t border-slate-100 pt-2 dark:border-slate-800">
            <div className="relative flex items-center justify-between rounded bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <span>Exitosa (200 OK)</span>
              <Handle
                type="source"
                position={Position.Right}
                id="success"
                className="!h-3 !w-3 !border-2 !border-white !bg-emerald-500 dark:!border-slate-900"
              />
            </div>
            <div className="relative flex items-center justify-between rounded bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
              <span>Fallida (Error API)</span>
              <Handle
                type="source"
                position={Position.Right}
                id="failure"
                className="!h-3 !w-3 !border-2 !border-white !bg-rose-500 dark:!border-slate-900"
              />
            </div>
          </div>
        )}

        {/* Standard Single Output Handle for normal nodes */}
        {nodeType !== 'eval_response' && nodeType !== 'smarton' && nodeType !== 'crm' && (
          <Handle
            type="source"
            position={Position.Right}
            id="out"
            className="!h-3.5 !w-3.5 !border-2 !border-white !bg-slate-600 hover:!bg-emerald-500 dark:!border-slate-900"
          />
        )}
      </div>
    </div>
  );
});
