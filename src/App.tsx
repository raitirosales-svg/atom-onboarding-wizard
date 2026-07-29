import React, { useState, useEffect } from 'react';
import { Project, ProjectVersion } from './types/canvas';
import { TEMPLATES } from './data/templates';
import { ProjectList } from './components/ProjectList';
import { CanvasEditor } from './components/CanvasEditor';
import { NewProjectModal } from './components/NewProjectModal';
import { I18nProvider } from './i18n';

const LOCAL_STORAGE_KEY = 'atom_scope_builder_projects_v2';

const INITIAL_DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-demo-1',
    name: 'Cliente E-commerce XYZ',
    industry: 'E-commerce',
    brandColor: '#FF6600',
    updatedAt: new Date().toISOString(),
    currentVersionNumber: 1,
    versions: [
      {
        versionNumber: 1,
        versionLabel: 'v1',
        createdAt: new Date().toISOString(),
        nodes: TEMPLATES['E-commerce'].nodes,
        edges: TEMPLATES['E-commerce'].edges,
        comments: TEMPLATES['E-commerce'].comments || [],
      },
    ],
  },
  {
    id: 'proj-demo-2',
    name: 'Clínica Salud Integral',
    industry: 'Salud',
    brandColor: '#059669',
    updatedAt: new Date().toISOString(),
    currentVersionNumber: 1,
    versions: [
      {
        versionNumber: 1,
        versionLabel: 'v1',
        createdAt: new Date().toISOString(),
        nodes: TEMPLATES['Salud'].nodes,
        edges: TEMPLATES['Salud'].edges,
        comments: TEMPLATES['Salud'].comments || [],
      },
    ],
  },
  {
    id: 'proj-demo-3',
    name: 'Grupo Inmobiliario Premier',
    industry: 'Inmobiliario',
    brandColor: '#FF6600',
    updatedAt: new Date().toISOString(),
    currentVersionNumber: 1,
    versions: [
      {
        versionNumber: 1,
        versionLabel: 'v1',
        createdAt: new Date().toISOString(),
        nodes: TEMPLATES['Inmobiliario'].nodes,
        edges: TEMPLATES['Inmobiliario'].edges,
        comments: [],
      },
    ],
  },
];

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error loading projects from localStorage:', err);
    }
    return INITIAL_DEMO_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeVersionNumber, setActiveVersionNumber] = useState<number>(1);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch (err) {
      console.error('Error saving projects to localStorage:', err);
    }
  }, [projects]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Open Canvas for project
  const handleOpenProject = (project: Project, versionNumber?: number) => {
    setActiveProjectId(project.id);
    setActiveVersionNumber(versionNumber || project.currentVersionNumber || 1);
  };

  // Back to Project List
  const handleBackToProjects = () => {
    setActiveProjectId(null);
  };

  // Create new project with template
  const handleCreateProject = (projectData: {
    name: string;
    industry: Project['industry'];
    brandColor: string;
    logo?: string;
  }) => {
    const templateData = TEMPLATES[projectData.industry] || TEMPLATES['Otro'];

    const newVersion: ProjectVersion = {
      versionNumber: 1,
      versionLabel: 'v1',
      createdAt: new Date().toISOString(),
      nodes: JSON.parse(JSON.stringify(templateData.nodes || [])),
      edges: JSON.parse(JSON.stringify(templateData.edges || [])),
      comments: JSON.parse(JSON.stringify(templateData.comments || [])),
    };

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectData.name,
      industry: projectData.industry,
      brandColor: projectData.brandColor,
      logo: projectData.logo,
      updatedAt: new Date().toISOString(),
      currentVersionNumber: 1,
      versions: [newVersion],
    };

    setProjects((prev) => [newProject, ...prev]);
    setShowNewModal(false);
    setActiveProjectId(newProject.id);
    setActiveVersionNumber(1);
  };

  // Save updated project (versioning)
  const handleSaveProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  // Delete project
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto y todas sus versiones?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
    }
  };

  // Duplicate project
  const handleDuplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name} (Copia)`,
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
  };

  return (
    <I18nProvider>
    <div className="min-h-screen bg-atom-light">
      {activeProject ? (
        <CanvasEditor
          project={activeProject}
          initialVersionNumber={activeVersionNumber}
          onSaveProject={handleSaveProject}
          onBackToProjects={handleBackToProjects}
        />
      ) : (
        <ProjectList
          projects={projects}
          onOpenProject={handleOpenProject}
          onOpenNewProjectModal={() => setShowNewModal(true)}
          onDeleteProject={handleDeleteProject}
          onDuplicateProject={handleDuplicateProject}
        />
      )}

      {showNewModal && (
        <NewProjectModal
          onCreateProject={handleCreateProject}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
    </I18nProvider>
  );
}
