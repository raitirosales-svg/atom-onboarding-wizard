import React, { useState } from 'react';
import { Project } from '../types/canvas';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Plus,
  Search,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  Copy,
  ExternalLink,
  Bot,
  Globe,
  ArrowRight,
  Check,
} from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onOpenProject: (project: Project, versionNumber?: number) => void;
  onOpenNewProjectModal: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onOpenProject,
  onOpenNewProjectModal,
  onDeleteProject,
  onDuplicateProject,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState('Todas');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<'Todas' | 'SP' | 'EN' | 'PT'>('Todas');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(search.toLowerCase()) ||
      proj.industry.toLowerCase().includes(search.toLowerCase());

    const matchesIndustry =
      selectedIndustryFilter === 'Todas' || proj.industry === selectedIndustryFilter;

    const projLang = proj.language || (proj.id === 'proj-demo-2' ? 'EN' : proj.id === 'proj-demo-3' ? 'PT' : 'SP');
    const matchesLanguage =
      selectedLanguageFilter === 'Todas' || projLang === selectedLanguageFilter;

    return matchesSearch && matchesIndustry && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar with App Title & Screen Language Switcher */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md font-black text-xl shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {t('appTitle')}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Onboarding Specialist
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* SCREEN LANGUAGE SWITCHER (EN, SP, PT) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 px-2 hidden lg:inline">
                {t('languageLabel')}
              </span>
              <button
                type="button"
                onClick={() => setLanguage('SP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  language === 'SP'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Cambiar idioma de la pantalla a Español"
              >
                <span>🇪🇸</span>
                <span>SP</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  language === 'EN'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Switch screen language to English"
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('PT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  language === 'PT'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Mudar idioma da tela para Português"
              >
                <span>🇧🇷</span>
                <span>PT</span>
              </button>
            </div>

            <button
              onClick={onOpenNewProjectModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t('btnNewProject')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner callout */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t('heroTag')}
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {t('heroTitle')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>

          <button
            onClick={onOpenNewProjectModal}
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl flex items-center gap-2 shrink-0 shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            {t('heroBtn')}
          </button>
        </div>

        {/* Global Screen Language Banner Selector (EN, SP, PT) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{t('languageLabel')}</span>
                  <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {language === 'SP' ? '🇪🇸 Español (SP)' : language === 'EN' ? '🇺🇸 English (EN)' : '🇧🇷 Português (PT)'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'SP'
                    ? 'Selecciona el idioma para traducir toda la pantalla, campos, botones e interfaz del sistema'
                    : language === 'EN'
                    ? 'Select the language to translate the entire screen, fields, buttons, and app interface'
                    : 'Selecione o idioma para traduzir toda a tela, campos, botões e interface do aplicativo'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span>{t('filterLanguage')}</span>
              <span className="text-blue-700 font-black">{language}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SP Screen Switcher */}
            <div
              onClick={() => setLanguage('SP')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                language === 'SP'
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl shadow-2xs rounded-md">🇪🇸</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>Español (SP)</span>
                      {language === 'SP' && <Check className="w-4 h-4 text-blue-600" />}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Latinoamérica y España
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 shadow-2xs">
                  {
                    projects.filter(
                      (p) =>
                        (p.language ||
                          (p.id === 'proj-demo-2'
                            ? 'EN'
                            : p.id === 'proj-demo-3'
                            ? 'PT'
                            : 'SP')) === 'SP'
                    ).length
                  } proyectos
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplica idioma Español a todos los textos, títulos, modales y botones de la pantalla.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-200/60 text-blue-700">
                <span>{language === 'SP' ? '✓ Pantalla en Español' : 'Cambiar pantalla a SP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* EN Screen Switcher */}
            <div
              onClick={() => setLanguage('EN')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                language === 'EN'
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl shadow-2xs rounded-md">🇺🇸</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>English (EN)</span>
                      {language === 'EN' && <Check className="w-4 h-4 text-blue-600" />}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Global & US Markets
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 shadow-2xs">
                  {
                    projects.filter(
                      (p) =>
                        (p.language ||
                          (p.id === 'proj-demo-2'
                            ? 'EN'
                            : p.id === 'proj-demo-3'
                            ? 'PT'
                            : 'SP')) === 'EN'
                    ).length
                  } projects
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies English translation across all titles, buttons, modals, and screen elements.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-200/60 text-blue-700">
                <span>{language === 'EN' ? '✓ Screen in English' : 'Switch screen to EN'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* PT Screen Switcher */}
            <div
              onClick={() => setLanguage('PT')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                language === 'PT'
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl shadow-2xs rounded-md">🇧🇷</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>Português (PT)</span>
                      {language === 'PT' && <Check className="w-4 h-4 text-blue-600" />}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Brasil & Portugal
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 shadow-2xs">
                  {
                    projects.filter(
                      (p) =>
                        (p.language ||
                          (p.id === 'proj-demo-2'
                            ? 'EN'
                            : p.id === 'proj-demo-3'
                            ? 'PT'
                            : 'SP')) === 'PT'
                    ).length
                  } projetos
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplica a tradução em português para todos os textos, botões, modais e elementos da tela.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-200/60 text-blue-700">
                <span>{language === 'PT' ? '✓ Tela em Português' : 'Mudar tela para PT'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'Todas', label: t('filterAllIndustries') },
              { id: 'E-commerce', label: 'E-commerce' },
              { id: 'Salud', label: language === 'EN' ? 'Healthcare' : language === 'PT' ? 'Saúde' : 'Salud' },
              { id: 'Servicios Financieros', label: language === 'EN' ? 'Finance' : language === 'PT' ? 'Finanças' : 'Servicios Financieros' },
              { id: 'Inmobiliario', label: language === 'EN' ? 'Real Estate' : language === 'PT' ? 'Imobiliário' : 'Inmobiliario' },
              { id: 'Educación', label: language === 'EN' ? 'Education' : language === 'PT' ? 'Educação' : 'Educación' },
              { id: 'Otro', label: language === 'EN' ? 'Other' : language === 'PT' ? 'Outro' : 'Otro' },
            ].map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustryFilter(ind.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  selectedIndustryFilter === ind.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">
                {t('noProjectsTitle')}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t('noProjectsDesc')}
              </p>
            </div>
            <button
              onClick={onOpenNewProjectModal}
              className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t('btnCreateFirstProject')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const latestVersionNumber = proj.currentVersionNumber || proj.versions.length || 1;
              const latestVersion =
                proj.versions.find((v) => v.versionNumber === latestVersionNumber) ||
                proj.versions[proj.versions.length - 1];

              const nodeCount = latestVersion?.nodes?.length || 0;
              const commentCount = latestVersion?.comments?.length || 0;
              const projLang = proj.language || (proj.id === 'proj-demo-2' ? 'EN' : proj.id === 'proj-demo-3' ? 'PT' : 'SP');

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden group"
                  style={{
                    borderTop: `4px solid ${proj.brandColor || '#2563EB'}`,
                  }}
                >
                  {/* Card Header */}
                  <div className="p-5 space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {proj.logo ? (
                          <div className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs">
                            <img src={proj.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-2xs shrink-0"
                            style={{ backgroundColor: proj.brandColor || '#2563EB' }}
                          >
                            {proj.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-700 transition-colors truncate">
                            {proj.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider"
                              style={{
                                backgroundColor: `${proj.brandColor}15`,
                                color: proj.brandColor || '#2563EB',
                              }}
                            >
                              {proj.industry}
                            </span>
                            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200/80 flex items-center gap-1">
                              {projLang === 'EN' ? '🇺🇸 EN' : projLang === 'PT' ? '🇧🇷 PT' : '🇪🇸 SP'}
                            </span>
                            <span className="text-[11px] font-extrabold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                              v{latestVersionNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>{nodeCount} {t('cardBlocks')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(proj.updatedAt).toLocaleDateString(language === 'EN' ? 'en-US' : language === 'PT' ? 'pt-BR' : 'es-ES')}</span>
                      </div>
                    </div>

                    {/* Version selector dropdown */}
                    {proj.versions.length > 1 && (
                      <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-[11px]">{t('cardVersionHistory')}</span>
                        <select
                          value={latestVersionNumber}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            onOpenProject(proj, Number(e.target.value));
                          }}
                          className="text-xs bg-slate-100 border border-slate-300 rounded-md px-2 py-0.5 font-semibold text-slate-800 focus:outline-none"
                        >
                          {proj.versions.map((v) => (
                            <option key={v.versionNumber} value={v.versionNumber}>
                              v{v.versionNumber} ({new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateProject(proj);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                        title={t('cardBtnDuplicate')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(proj);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title={t('cardBtnDelete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(proj, latestVersionNumber);
                      }}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>{t('cardBtnOpen')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {language === 'EN' ? 'Delete Project?' : language === 'PT' ? 'Excluir Projeto?' : '¿Eliminar Proyecto?'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === 'EN'
                    ? `Are you sure you want to delete "${projectToDelete.name}"? This action cannot be undone.`
                    : language === 'PT'
                    ? `Tem certeza de que deseja excluir "${projectToDelete.name}"? Esta ação não pode ser desfeita.`
                    : `¿Estás seguro de que deseas eliminar "${projectToDelete.name}"? Esta acción eliminará permanentemente el flujo y sus versiones.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                {language === 'EN' ? 'Cancel' : language === 'PT' ? 'Cancelar' : 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                {language === 'EN' ? 'Delete Project' : language === 'PT' ? 'Excluir Projeto' : 'Eliminar Proyecto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
