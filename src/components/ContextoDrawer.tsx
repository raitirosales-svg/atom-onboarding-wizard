import React from 'react';
import {
  X,
  FileText,
  Target,
  Bot,
  UserCheck,
  Building2,
  Plug,
  Tag as TagIcon,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { ProjectContexto } from '../types/canvas';
import { useTranslation } from '../i18n/LanguageContext';

interface ContextoDrawerProps {
  projectName: string;
  industry: string;
  brandColor: string;
  contexto?: ProjectContexto;
  onClose: () => void;
}

export const ContextoDrawer: React.FC<ContextoDrawerProps> = ({
  projectName,
  industry,
  brandColor,
  contexto,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!contexto) {
    return (
      <div className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl z-30 shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            {t('contextDrawerTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">{t('ctxEmptyTitle')}</p>
          <p>
            {t('ctxEmptyDesc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl z-30 shrink-0 font-sans">
      {/* Header */}
      <div
        className="p-4 border-b border-slate-200 flex items-center justify-between"
        style={{ backgroundColor: `${brandColor}12` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
            style={{ backgroundColor: brandColor || '#2563EB' }}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              {t('contextDrawerTitle')}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
              {projectName} • {industry}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-700">
        {/* SECTION 1: Identidad & Tono */}
        <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-blue-700">
            <Building2 className="w-4 h-4 text-blue-600" />
            1. {t('contextSec1')}
          </h4>

          <div className="space-y-1.5 pt-1">
            {contexto.brandTone && (
              <div>
                <span className="font-semibold text-slate-500">{t('ctxToneLabel')} </span>
                <span className="font-bold text-slate-800 bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md">
                  {contexto.brandTone}
                </span>
              </div>
            )}

            {contexto.toneDetails && (
              <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                "{contexto.toneDetails}"
              </p>
            )}

            {contexto.companyInfo && (
              <div className="pt-1">
                <span className="font-semibold text-slate-500 block mb-0.5">{t('ctxCompanyInfoLabel')}</span>
                <p className="text-slate-700 leading-relaxed bg-white p-2 rounded-lg border border-slate-200">
                  {contexto.companyInfo}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Objetivos de Negocio */}
        <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-purple-700">
            <Target className="w-4 h-4 text-purple-600" />
            2. {t('contextSec2')}
          </h4>

          {/* Goals chips */}
          {contexto.botGoals && contexto.botGoals.length > 0 && (
            <div>
              <span className="font-semibold text-slate-500 block mb-1">{t('ctxGoalsLabel')}</span>
              <div className="flex flex-wrap gap-1">
                {contexto.botGoals.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 bg-purple-100 text-purple-900 text-[11px] font-bold rounded-md border border-purple-200"
                  >
                    ✓ {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Priority cases */}
          {contexto.priorityUseCases && (
            <div>
              <span className="font-semibold text-slate-500 block mb-0.5">{t('ctxPriorityCasesLabel')}</span>
              <p className="bg-white p-2 rounded-lg border border-slate-200 leading-relaxed">
                {contexto.priorityUseCases}
              </p>
            </div>
          )}

          {/* What NOT to do */}
          {contexto.whatNotToDo && (
            <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 space-y-1">
              <span className="font-bold text-rose-800 flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                {t('ctxWhatNotToDoLabel')}
              </span>
              <p className="text-rose-900 text-[11px] leading-relaxed">
                {contexto.whatNotToDo}
              </p>
            </div>
          )}

          {/* Human handoff trigger */}
          {contexto.humanHandoffTrigger && (
            <div>
              <span className="font-semibold text-slate-500 block mb-0.5">{t('ctxHandoffLabel')}</span>
              <p className="bg-white p-2 rounded-lg border border-slate-200 leading-relaxed text-[11px]">
                {contexto.humanHandoffTrigger}
              </p>
            </div>
          )}

          {/* Integrations */}
          {contexto.expectedIntegrations && contexto.expectedIntegrations.length > 0 && (
            <div>
              <span className="font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                <Plug className="w-3.5 h-3.5 text-purple-600" /> {t('ctxIntegrationsLabel')}
              </span>
              <div className="flex flex-wrap gap-1">
                {contexto.expectedIntegrations.map((i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded-md"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Cierre, Tipificaciones & Tags */}
        <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            3. {t('contextSec3')}
          </h4>

          {/* Successful ending */}
          {contexto.successfulEnding && (
            <div>
              <span className="font-semibold text-slate-500 block mb-0.5">{t('ctxSuccessEndingLabel')}</span>
              <p className="bg-white p-2 rounded-lg border border-slate-200 leading-relaxed text-[11px]">
                {contexto.successfulEnding}
              </p>
            </div>
          )}

          {/* Typifications */}
          {contexto.typifications && contexto.typifications.length > 0 && (
            <div>
              <span className="font-semibold text-slate-500 block mb-1">{t('ctxTypificationsLabel')}</span>
              <div className="space-y-1">
                {contexto.typifications.map((t) => (
                  <div
                    key={t}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-900 text-[11px] font-semibold rounded-lg border border-emerald-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Funnel Stages */}
          {contexto.funnelStages && contexto.funnelStages.length > 0 && (
            <div>
              <span className="font-semibold text-slate-500 block mb-1">{t('ctxFunnelLabel')}</span>
              <div className="flex flex-wrap gap-1">
                {contexto.funnelStages.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested tags */}
          {contexto.suggestedTags && contexto.suggestedTags.length > 0 && (
            <div>
              <span className="font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                <TagIcon className="w-3.5 h-3.5 text-blue-600" /> {t('ctxTagsLabel')}
              </span>
              <div className="flex flex-wrap gap-1">
                {contexto.suggestedTags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-mono font-bold rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
