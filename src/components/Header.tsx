import React from 'react';
import {
  FileText,
  Play,
  Download,
  Sparkles,
  Layers,
  GitCommit,
  Globe,
} from 'lucide-react';
import { ProjectMetadata } from '../types';
import { useLanguage, Language } from '../i18n';

interface HeaderProps {
  projectMeta: ProjectMetadata;
  onUpdateProjectMeta: (meta: ProjectMetadata) => void;
  nodeCount: number;
  edgeCount: number;
  onOpenFichaTecnica: () => void;
  onOpenSimulator: () => void;
  onOpenExportModal: () => void;
  onOpenAiSuggestions: () => void;
}

const AtomLogoIcon = ({ className = "h-9 w-9" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="atomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6000" />
        <stop offset="100%" stopColor="#E04800" />
      </linearGradient>
    </defs>
    {/* Base Circle with margin padding to avoid edge clipping */}
    <circle cx="50" cy="50" r="46" fill="url(#atomGradient)" />

    {/* Concentric rings tapering inwards towards center-left */}
    <circle cx="44" cy="54" r="36" fill="#FF7824" opacity="0.6" />
    <circle cx="44" cy="54" r="28" fill="#FF9048" opacity="0.65" />
    <circle cx="44" cy="54" r="20" fill="#FFAA6E" opacity="0.7" />
    <circle cx="44" cy="54" r="13" fill="#FFC899" opacity="0.8" />

    {/* White Chat Mascot Bubble */}
    <path
      d="M44 41C36.268 41 30 47.268 30 55C30 58.2 31.1 61.15 32.9 63.5L30.5 70.5L37.5 68.1C39.5 69.3 41.7 70 44 70C51.732 70 58 63.732 58 55C58 47.268 51.732 41 44 41Z"
      fill="#FFFFFF"
    />

    {/* Eyes */}
    <circle cx="40" cy="54" r="2.2" fill="#0F172A" />
    <circle cx="48" cy="54" r="2.2" fill="#0F172A" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  projectMeta,
  onUpdateProjectMeta,
  nodeCount,
  edgeCount,
  onOpenFichaTecnica,
  onOpenSimulator,
  onOpenExportModal,
  onOpenAiSuggestions,
}) => {
  const { lang, setLang, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
  ];

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3.5">
        <AtomLogoIcon className="h-9 w-9 shrink-0 drop-shadow-xs" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('appName')}
            </h1>
            <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-950/80 dark:text-orange-300">
              {t('engineName')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <input
              type="text"
              value={projectMeta.name}
              onChange={(e) => onUpdateProjectMeta({ ...projectMeta, name: e.target.value })}
              placeholder={t('flowNamePlaceholder')}
              className="h-5 border-none bg-transparent font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:decoration-orange-500 focus:outline-hidden dark:text-slate-300"
            />
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px]">
              <Layers className="h-3 w-3 text-slate-400" /> {t('nodesCount', { count: nodeCount })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px]">
              <GitCommit className="h-3 w-3 text-slate-400" /> {t('connectionsCount', { count: edgeCount })}
            </span>
          </div>
        </div>
      </div>

      {/* Language Selector & Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Language Selector Pill Group */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-900">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => setLang(item.code)}
              className={`rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                lang === item.code
                  ? 'bg-[var(--atom-orange)] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAiSuggestions}
          className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/80 px-3 py-1.5 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/60"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t('aiSuggestionsBtn')}</span>
        </button>

        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Play className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
          <span>{t('simulatorBtn')}</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>{t('flowPlanBtn')}</span>
        </button>

        <button
          onClick={onOpenFichaTecnica}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--atom-orange)] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[var(--atom-orange-hover)] active:scale-95"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>{t('generateSpecBtn')}</span>
        </button>
      </div>
    </header>
  );
};

