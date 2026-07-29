import React, { useState, useEffect } from 'react';
import { Project, ProjectVersion } from './types/canvas';
import { TEMPLATES } from './data/templates';
import { ProjectList } from './components/ProjectList';
import { CanvasEditor } from './components/CanvasEditor';
import { NewProjectModal } from './components/NewProjectModal';

const LOCAL_STORAGE_KEY = 'atom_scope_builder_projects_v2';

// Default starter projects if localStorage is empty
const INITIAL_DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-demo-1',
    name: 'Cliente E-commerce XYZ',
    industry: 'E-commerce',
    brandColor: '#2563EB',
    language: 'SP',
    updatedAt: new Date().toISOString(),
    currentVersionNumber: 1,
    contexto: {
      brandTone: 'Cercano y amigable',
      toneDetails: 'Usar emojis, tutear al usuario, evitar tecnicismos.',
      companyInfo: 'Tienda de moda en línea con envíos a todo el país.',
      language: 'SP',
      botGoals: ['Generar leads', 'Responder preguntas frecuentes', 'Vender productos'],
      priorityUseCases: 'Consultas de catálogo, estado de envío de pedidos y soporte de cambios.',
      whatNotToDo: 'No ofrecer descuentos adicionales sin cupón válido.',
      humanHandoffTrigger: 'Cuando soliciten hablar con un asesor o reclamo de garantía.',
      expectedIntegrations: ['CRM', 'Pasarela de pago'],
      successfulEnding: 'Pedido realizado o derivación confirmada a agente de soporte.',
      typifications: [
        'Fin Autogestión (resuelto por el bot)',
        'Seguimiento Autogestión (requiere reactivación o intervención humana)',
        'Venta Exitosa',
      ],
      funnelStages: ['Awareness', 'Interest', 'Opportunity'],
      suggestedTags: ['cliente_vip', 'ecommerce_lead', 'soporte_envios'],
    },
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
    language: 'EN',
    updatedAt: new Date().toISOString(),
    currentVersionNumber: 1,
    contexto: {
      brandTone: 'Formal y profesional',
      toneDetails: 'Tratar de usted, lenguaje claro, alto nivel de empatía.',
      companyInfo: 'Red de centros médicos especializados en consultas generales y laboratorio.',
      language: 'EN',
      botGoals: ['Agendar citas', 'Responder preguntas frecuentes', 'Calificar prospectos'],
      priorityUseCases: 'Agendamiento de citas médicas por especialidad y consulta de horarios.',
      whatNotToDo: 'Nunca emitir diagnósticos médicos ni recomendar medicamentos.',
      humanHandoffTrigger: 'Casos de urgencia médica o insatisfacción.',
      expectedIntegrations: ['Agenda-calendario', 'Base de datos propia'],
      successfulEnding: 'Cita reservada en sistema con correo de confirmación enviado.',
      typifications: [
        'Fin Autogestión (resuelto por el bot)',
        'Seguimiento Autogestión (requiere reactivación o intervención humana)',
        'Cita Agendada',
      ],
      funnelStages: ['Awareness', 'Consideration', 'Opportunity'],
      suggestedTags: ['paciente_nuevo', 'cita_medica', 'urgencia'],
    },
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
    brandColor: '#7C3AED',
    language: 'PT',
    updatedAt: new Date().toISOString(),
    currentVersionNumber: 1,
    contexto: {
      brandTone: 'Formal y profesional',
      toneDetails: 'Énfasis en exclusividad y atención personalizada.',
      companyInfo: 'Desarrollador de proyectos residenciales de alto valor.',
      language: 'PT',
      botGoals: ['Generar leads', 'Calificar prospectos', 'Agendar citas'],
      priorityUseCases: 'Captura de presupuesto e interés de compra para enviar brochure en PDF.',
      whatNotToDo: 'No prometer precios fijos sin previa evaluación financiera.',
      humanHandoffTrigger: 'Lead con presupuesto calificado listo para visita presencial.',
      expectedIntegrations: ['CRM', 'Agenda-calendario'],
      successfulEnding: 'Lead calificado y registrado en CRM con ejecutivo asignado.',
      typifications: [
        'Fin Autogestión (resuelto por el bot)',
        'Seguimiento Autogestión (requiere reactivación o intervención humana)',
        'Lead Calificado High-Ticket',
      ],
      funnelStages: ['Interest', 'Consideration', 'Opportunity'],
      suggestedTags: ['inversor', 'brochure_enviado', 'visita_agendada'],
    },
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

  // Create new project with template and wizard contexto
  const handleCreateProject = (projectData: {
    name: string;
    industry: Project['industry'];
    brandColor: string;
    logo?: string;
    contexto: Project['contexto'];
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
      language: projectData.contexto?.language || 'SP',
      updatedAt: new Date().toISOString(),
      currentVersionNumber: 1,
      contexto: projectData.contexto,
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
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
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
    <ErrorBoundary>
    <div className="min-h-screen bg-slate-50">
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
    </ErrorBoundary>
  );
}

// ── ERROR BOUNDARY ──
class ErrorBoundary extends React.Component<{}, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    const self = this as any;
    if (self.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
          <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="text-5xl mb-4">!</div>
            <h1 className="text-xl font-extrabold text-red-600 mb-2">Error inesperado</h1>
            <p className="text-sm text-slate-600 mb-4">{self.state.error.message}</p>
            <pre className="text-xs text-left bg-slate-100 p-3 rounded-lg overflow-auto max-h-40 mb-4">{self.state.error.stack?.substring(0, 500)}</pre>
            <button onClick={() => { self.setState({ error: null }); window.location.reload(); }}
              className="rounded-lg bg-atom-orange px-4 py-2 text-sm font-bold text-white">Reintentar</button>
          </div>
        </div>
      );
    }
    return self.props.children;
  }
}
