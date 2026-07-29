import React, { useState } from 'react';
import { Project } from '../types/canvas';
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
  const [search, setSearch] = useState('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState('Todas');

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(search.toLowerCase()) ||
      proj.industry.toLowerCase().includes(search.toLowerCase());

    const matchesIndustry =
      selectedIndustryFilter === 'Todas' || proj.industry === selectedIndustryFilter;

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md font-black text-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Atom Scope Builder
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Onboarding Specialist
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Mapeo de flujos conversacionales en vivo & Generación automática de Fichas Técnicas
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNewProjectModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Nuevo proyecto
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner callout */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Herramienta de Compartición de Pantalla en Vivo
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Diseña la arquitectura de WhatsApp frente a tu cliente
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Conecta bloques de mensajes, evaluaciones de respuesta, reglas de negocio e integraciones externas. Al finalizar la videollamada, genera la Ficha Técnica oficial impulsada por IA.
            </p>
          </div>

          <button
            onClick={onOpenNewProjectModal}
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl flex items-center gap-2 shrink-0 shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            Iniciar Mapeo con Cliente
          </button>
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
              placeholder="Buscar por cliente o industria..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['Todas', 'E-commerce', 'Salud', 'Servicios Financieros', 'Inmobiliario', 'Educación', 'Otro'].map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustryFilter(ind)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  selectedIndustryFilter === ind
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ind}
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
                No hay proyectos que coincidan
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Crea un nuevo proyecto para iniciar el mapeo del chatbot con un cliente durante tu llamada de onboarding.
              </p>
            </div>
            <button
              onClick={onOpenNewProjectModal}
              className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Crear primer proyecto
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
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider"
                              style={{
                                backgroundColor: `${proj.brandColor}15`,
                                color: proj.brandColor || '#2563EB',
                              }}
                            >
                              {proj.industry}
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
                        <span>{nodeCount} Bloques de Flujo</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(proj.updatedAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>

                    {/* Version selector dropdown */}
                    {proj.versions.length > 1 && (
                      <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-[11px]">Historial de Versiones:</span>
                        <select
                          value={latestVersionNumber}
                          onChange={(e) => onOpenProject(proj, Number(e.target.value))}
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
                        onClick={() => onDuplicateProject(proj)}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                        title="Duplicar proyecto"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenProject(proj, latestVersionNumber)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>Abrir Canvas</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
