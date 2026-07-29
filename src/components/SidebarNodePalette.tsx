import React, { useState } from 'react';
import {
  MessageSquare,
  FileText,
  MousePointerClick,
  GitBranch,
  CheckCircle2,
  Clock,
  Database,
  Sparkles,
  Tag,
  Kanban,
  Users,
  Globe,
  Plus,
  FolderKanban,
  Layers,
  Sliders,
} from 'lucide-react';
import { NodeType, ProjectMetadata } from '../types';
import { PREBUILT_TEMPLATES } from '../data/templates';
import { useLanguage } from '../i18n';

interface SidebarNodePaletteProps {
  onAddNode: (type: NodeType) => void;
  projectMeta: ProjectMetadata;
  onUpdateProjectMeta: (meta: ProjectMetadata) => void;
  onLoadTemplate: (templateId: string) => void;
}

interface PaletteCategory {
  title: string;
  items: {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ElementType;
    badgeBg: string;
  }[];
}

export const SidebarNodePalette: React.FC<SidebarNodePaletteProps> = ({
  onAddNode,
  projectMeta,
  onUpdateProjectMeta,
  onLoadTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'project' | 'templates'>('nodes');
  const { t } = useLanguage();

  const categories: PaletteCategory[] = [
    {
      title: t('catMessages'),
      items: [
        {
          type: 'message',
          label: t('nodeMessageLabel'),
          description: t('nodeMessageDesc'),
          icon: MessageSquare,
          badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        },
        {
          type: 'template',
          label: t('nodeTemplateLabel'),
          description: t('nodeTemplateDesc'),
          icon: FileText,
          badgeBg: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
        },
      ],
    },
    {
      title: t('catInteraction'),
      items: [
        {
          type: 'eval_response',
          label: t('nodeEvalResponseLabel'),
          description: t('nodeEvalResponseDesc'),
          icon: MousePointerClick,
          badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        },
        {
          type: 'delay',
          label: t('nodeDelayLabel'),
          description: t('nodeDelayDesc'),
          icon: Clock,
          badgeBg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        },
      ],
    },
    {
      title: t('catAi'),
      items: [
        {
          type: 'smarton',
          label: t('nodeSmartonLabel'),
          description: t('nodeSmartonDesc'),
          icon: Sparkles,
          badgeBg: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
        },
      ],
    },
    {
      title: t('catLogic'),
      items: [
        {
          type: 'save_field',
          label: t('nodeSaveFieldLabel'),
          description: t('nodeSaveFieldDesc'),
          icon: Database,
          badgeBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
        },
        {
          type: 'condition',
          label: t('nodeConditionLabel'),
          description: t('nodeConditionDesc'),
          icon: GitBranch,
          badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        },
        {
          type: 'tag',
          label: t('nodeTagLabel'),
          description: t('nodeTagDesc'),
          icon: Tag,
          badgeBg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
        },
        {
          type: 'customer_stage',
          label: t('nodeCustomerStageLabel'),
          description: t('nodeCustomerStageDesc'),
          icon: Kanban,
          badgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
        },
      ],
    },
    {
      title: t('catIntegrations'),
      items: [
        {
          type: 'crm',
          label: t('nodeCrmLabel'),
          description: t('nodeCrmDesc'),
          icon: Globe,
          badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
        },
        {
          type: 'assign_group',
          label: t('nodeAssignGroupLabel'),
          description: t('nodeAssignGroupDesc'),
          icon: Users,
          badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        },
        {
          type: 'typification',
          label: t('nodeTypificationLabel'),
          description: t('nodeTypificationDesc'),
          icon: CheckCircle2,
          badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      {/* Sidebar Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
            activeTab === 'nodes'
              ? 'border-b-2 border-[var(--atom-orange)] text-[var(--atom-orange)]'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          {t('tabNodes')}
        </button>
        <button
          onClick={() => setActiveTab('project')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
            activeTab === 'project'
              ? 'border-b-2 border-[var(--atom-orange)] text-[var(--atom-orange)]'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          {t('tabProject')}
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
            activeTab === 'templates'
              ? 'border-b-2 border-[var(--atom-orange)] text-[var(--atom-orange)]'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FolderKanban className="h-3.5 w-3.5" />
          {t('tabTemplates')}
        </button>
      </div>

      {/* Tab 1: Node Library */}
      {activeTab === 'nodes' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {cat.title}
              </h4>
              <div className="space-y-1.5">
                {cat.items.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => onAddNode(item.type)}
                      className="group flex w-full items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 text-left shadow-xs transition-all hover:border-[var(--atom-orange)] hover:bg-orange-50/30 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-[var(--atom-orange)] dark:hover:bg-slate-900"
                    >
                      <div className="mt-0.5 shrink-0 rounded-md p-1.5 bg-slate-100 group-hover:bg-orange-100 dark:bg-slate-800 dark:group-hover:bg-orange-950/60">
                        <IconComp className="h-4 w-4 text-slate-700 group-hover:text-[var(--atom-orange)] dark:text-slate-300 dark:group-hover:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {item.label}
                          </span>
                          <Plus className="h-3.5 w-3.5 text-slate-400 group-hover:text-[var(--atom-orange)] dark:group-hover:text-orange-400" />
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[10px] text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Project Metadata Details */}
      {activeTab === 'project' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t('projectMetadataTitle')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                {t('projectNameLabel')}:
              </label>
              <input
                type="text"
                value={projectMeta.name}
                onChange={(e) => onUpdateProjectMeta({ ...projectMeta, name: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                {t('clientNameLabel')}:
              </label>
              <input
                type="text"
                value={projectMeta.clientName}
                onChange={(e) => onUpdateProjectMeta({ ...projectMeta, clientName: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                {t('industryLabel')}:
              </label>
              <input
                type="text"
                value={projectMeta.industry}
                onChange={(e) => onUpdateProjectMeta({ ...projectMeta, industry: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                {t('objectiveLabel')}:
              </label>
              <textarea
                rows={3}
                value={projectMeta.objective}
                onChange={(e) => onUpdateProjectMeta({ ...projectMeta, objective: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                {t('authorLabel')}:
              </label>
              <input
                type="text"
                value={projectMeta.author}
                onChange={(e) => onUpdateProjectMeta({ ...projectMeta, author: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-[var(--atom-orange)] focus:outline-hidden dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Prebuilt Flow Templates */}
      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('templatesDesc')}
          </p>
          {PREBUILT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-950 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {tmpl.name}
                </span>
                <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {tmpl.description}
              </p>
              <button
                onClick={() => onLoadTemplate(tmpl.id)}
                className="w-full rounded-md bg-[var(--atom-orange)] py-1.5 text-xs font-medium text-white hover:bg-[var(--atom-orange-hover)] transition-colors"
              >
                {t('loadTemplateBtn')}
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

