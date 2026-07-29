import React from 'react';
import { MessageSquare, FileText, MousePointerClick, GitBranch, CheckCircle2, Clock, Database, Sparkles, Tag, Kanban, Users, Globe, Plus, Layers } from 'lucide-react';
import { NodeType } from '../types';
import { useLanguage } from '../i18n';

interface SidebarNodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

interface PaletteItem {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ElementType;
}

export const SidebarNodePalette: React.FC<SidebarNodePaletteProps> = ({ onAddNode }) => {
  const { t } = useLanguage();

  const categories: { title: string; items: PaletteItem[] }[] = [
    {
      title: t('catMessages'),
      items: [
        { type: 'message', label: t('nodeMessageLabel'), description: t('nodeMessageDesc'), icon: MessageSquare },
        { type: 'template', label: t('nodeTemplateLabel'), description: t('nodeTemplateDesc'), icon: FileText },
      ],
    },
    {
      title: t('catInteraction'),
      items: [
        { type: 'eval_response', label: t('nodeEvalResponseLabel'), description: t('nodeEvalResponseDesc'), icon: MousePointerClick },
        { type: 'delay', label: t('nodeDelayLabel'), description: t('nodeDelayDesc'), icon: Clock },
      ],
    },
    {
      title: t('catAi'),
      items: [
        { type: 'smarton', label: t('nodeSmartonLabel'), description: t('nodeSmartonDesc'), icon: Sparkles },
      ],
    },
    {
      title: t('catLogic'),
      items: [
        { type: 'save_field', label: t('nodeSaveFieldLabel'), description: t('nodeSaveFieldDesc'), icon: Database },
        { type: 'condition', label: t('nodeConditionLabel'), description: t('nodeConditionDesc'), icon: GitBranch },
        { type: 'tag', label: t('nodeTagLabel'), description: t('nodeTagDesc'), icon: Tag },
        { type: 'customer_stage', label: t('nodeCustomerStageLabel'), description: t('nodeCustomerStageDesc'), icon: Kanban },
      ],
    },
    {
      title: t('catIntegrations'),
      items: [
        { type: 'crm', label: t('nodeCrmLabel'), description: t('nodeCrmDesc'), icon: Globe },
        { type: 'assign_group', label: t('nodeAssignGroupLabel'), description: t('nodeAssignGroupDesc'), icon: Users },
        { type: 'typification', label: t('nodeTypificationLabel'), description: t('nodeTypificationDesc'), icon: CheckCircle2 },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <Layers className="h-4 w-4 text-[var(--atom-orange)]" />
        <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">{t('tabNodes')}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{cat.title}</h4>
            <div className="space-y-1">
              {cat.items.map((item) => {
                const IconComp = item.icon;
                return (
                  <button key={item.type} onClick={() => onAddNode(item.type)}
                    className="group flex w-full items-start gap-2 rounded-lg border border-slate-200 bg-white p-2 text-left shadow-xs transition-all hover:border-[var(--atom-orange)] hover:bg-orange-50/30 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-[var(--atom-orange)]">
                    <div className="mt-0.5 shrink-0 rounded-md p-1 bg-slate-100 group-hover:bg-orange-100 dark:bg-slate-800">
                      <IconComp className="h-3.5 w-3.5 text-slate-600 group-hover:text-[var(--atom-orange)] dark:text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-[11px] font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        <Plus className="h-3 w-3 text-slate-300 group-hover:text-[var(--atom-orange)]" />
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-400 dark:text-slate-500">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
