import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  MessageSquareText,
  FileCode,
  GitFork,
  GitBranch,
  CornerDownRight,
  Clock,
  StopCircle,
  Database,
  MapPin,
  Sparkles,
  Wand2,
  Tag,
  TrendingUp,
  FolderCheck,
  Users,
  Plug,
  CreditCard,
  Server,
  Globe,
  Send,
  UserCheck,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
    type: string;
    category: string;
    iconName?: string;
    color?: string;
    isIntegration?: boolean;
    options?: string[];
    systemName?: string;
    fieldName?: string;
    comments?: any[];
    onOpenComments?: (nodeId: string) => void;
  };
  selected?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquareText,
  FileCode,
  GitFork,
  GitBranch,
  CornerDownRight,
  Clock,
  StopCircle,
  Database,
  MapPin,
  Sparkles,
  Wand2,
  Tag,
  TrendingUp,
  FolderCheck,
  Users,
  Plug,
  CreditCard,
  Server,
  Globe,
  Send,
  UserCheck,
};

export const CustomNode: React.FC<CustomNodeProps> = ({ id, data, selected }) => {
  const { t } = useTranslation();
  const IconComponent = (data.iconName && ICON_MAP[data.iconName]) || MessageSquareText;
  const isIntegration = !!data.isIntegration;
  const commentCount = data.comments?.length || 0;
  const mainColor = data.color || (isIntegration ? '#DC2626' : '#2563EB');

  const options = data.options && data.options.length > 0 ? data.options : [];

  return (
    <div
      className={`relative rounded-xl bg-white transition-all shadow-md ${
        selected ? 'ring-2 ring-blue-600 shadow-xl' : 'hover:shadow-lg'
      } ${
        isIntegration
          ? 'w-80 border-2 border-dashed border-purple-500/80 bg-gradient-to-b from-purple-50/40 to-white'
          : 'w-72 border border-slate-200'
      }`}
    >
      {/* Target handle on top */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3.5 !h-3.5 !bg-slate-700 !border-2 !border-white hover:!scale-125 transition-transform"
      />

      {/* Node Accent Header */}
      <div
        className="px-3.5 py-2.5 rounded-t-xl flex items-center justify-between gap-2 border-b border-slate-100"
        style={{ backgroundColor: `${mainColor}12` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: mainColor }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span
              className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md inline-block max-w-full truncate"
              style={{ backgroundColor: `${mainColor}20`, color: mainColor }}
            >
              {isIntegration ? t('integration') : data.category || t('step')}
            </span>
          </div>
        </div>

        {/* Comment Bubble Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (data.onOpenComments) data.onOpenComments(id);
          }}
          title={t('viewComments')}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            commentCount > 0
              ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {commentCount > 0 && <span className="text-[11px] font-bold">{commentCount}</span>}
        </button>
      </div>

      {/* Node Body */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
            {data.label}
          </h4>
        </div>

        {data.description && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {data.description}
          </p>
        )}

        {/* Integration metadata badge */}
        {isIntegration && (
          <div className="mt-2.5 pt-2 border-t border-purple-100 flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50/80 px-2.5 py-1.5 rounded-md">
            <Plug className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="truncate">
              {data.systemName ? `${t('connection')}: ${data.systemName}` : t('apiConnector')}
            </span>
          </div>
        )}

        {/* Save field metadata badge */}
        {data.type === 'save_field' && data.fieldName && (
          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-mono">
            {t('variable')}: <span className="font-bold">{data.fieldName}</span>
          </div>
        )}

        {/* Eval Response Options / Branches */}
        {data.type === 'eval_response' && options.length > 0 && (
          <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t('responseBranches')}
            </span>
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200/80 px-2.5 py-1 rounded-md text-amber-900 font-medium"
              >
                <span className="truncate pr-4">{opt}</span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`opt-${opt}`}
                  className="!w-3 !h-3 !bg-amber-600 !border-2 !border-white hover:!scale-125"
                  style={{ right: -12 }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Condition Node Handles */}
        {data.type === 'condition' && (
          <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div className="relative text-center text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 py-1 rounded-md font-semibold">
              {t('conditionYes')}
              <Handle
                type="source"
                position={Position.Right}
                id="si"
                className="!w-3 !h-3 !bg-emerald-600 !border-2 !border-white hover:!scale-125"
                style={{ right: -12 }}
              />
            </div>
            <div className="relative text-center text-xs bg-rose-50 text-rose-800 border border-rose-200 py-1 rounded-md font-semibold">
              {t('conditionNo')}
              <Handle
                type="source"
                position={Position.Right}
                id="no"
                className="!w-3 !h-3 !bg-rose-600 !border-2 !border-white hover:!scale-125"
                style={{ right: -12 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Default bottom output handle for non-branching nodes */}
      {data.type !== 'eval_response' && data.type !== 'condition' && data.type !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-slate-700 !border-2 !border-white hover:!scale-125 transition-transform"
        />
      )}
    </div>
  );
};
