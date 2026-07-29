import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'es' | 'en' | 'pt';

const LANG_KEY = 'atom_lang';

const translations: Record<string, Record<Language, string>> = {
  // ── Project List ──
  'app.title': { es: 'ATOM Scope Builder', en: 'ATOM Scope Builder', pt: 'ATOM Scope Builder' },
  'app.subtitle': { es: 'Define flujos conversacionales y expórtalos a FlowBuilder', en: 'Define conversational flows and export to FlowBuilder', pt: 'Defina fluxos conversacionais e exporte para o FlowBuilder' },
  'projects.title': { es: 'Mis Proyectos', en: 'My Projects', pt: 'Meus Projetos' },
  'projects.search': { es: 'Buscar proyectos...', en: 'Search projects...', pt: 'Buscar projetos...' },
  'projects.all': { es: 'Todas las industrias', en: 'All industries', pt: 'Todas as indústrias' },
  'projects.empty': { es: 'No hay proyectos. Crea el primero.', en: 'No projects. Create the first one.', pt: 'Nenhum projeto. Crie o primeiro.' },
  'projects.new': { es: 'Nuevo Proyecto', en: 'New Project', pt: 'Novo Projeto' },
  'projects.steps': { es: 'Pasos', en: 'Steps', pt: 'Passos' },
  'projects.integrations': { es: 'Integraciones', en: 'Integrations', pt: 'Integrações' },
  'projects.duplicate': { es: 'Duplicar', en: 'Duplicate', pt: 'Duplicar' },
  'projects.delete': { es: 'Eliminar', en: 'Delete', pt: 'Excluir' },
  'projects.open': { es: 'Abrir Canvas', en: 'Open Canvas', pt: 'Abrir Canvas' },
  'projects.version': { es: 'Versión', en: 'Version', pt: 'Versão' },
  'projects.modified': { es: 'Modificado', en: 'Modified', pt: 'Modificado' },
  'projects.hero': { es: 'Construye flujos conversacionales profesionales con inteligencia artificial.', en: 'Build professional conversational flows with AI.', pt: 'Construa fluxos conversacionais profissionais com IA.' },

  // ── New Project Modal ──
  'new.title': { es: 'Nuevo Proyecto', en: 'New Project', pt: 'Novo Projeto' },
  'new.clientName': { es: 'Nombre del cliente', en: 'Client name', pt: 'Nome do cliente' },
  'new.clientName_ph': { es: 'Ej: Hansa Automotriz', en: 'Ex: Hansa Automotive', pt: 'Ex: Hansa Automotiva' },
  'new.industry': { es: 'Industria', en: 'Industry', pt: 'Indústria' },
  'new.selectIndustry': { es: 'Seleccionar industria', en: 'Select industry', pt: 'Selecionar indústria' },
  'new.brandColor': { es: 'Color de marca', en: 'Brand color', pt: 'Cor da marca' },
  'new.logo': { es: 'Logo (opcional)', en: 'Logo (optional)', pt: 'Logo (opcional)' },
  'new.create': { es: 'Crear Proyecto', en: 'Create Project', pt: 'Criar Projeto' },
  'new.cancel': { es: 'Cancelar', en: 'Cancel', pt: 'Cancelar' },
  'new.template': { es: 'Se cargará una plantilla predefinida para esta industria', en: 'A predefined template will be loaded for this industry', pt: 'Um modelo predefinido será carregado para esta indústria' },

  // ── Canvas Header ──
  'canvas.back': { es: '← Proyectos', en: '← Projects', pt: '← Projetos' },
  'canvas.steps': { es: 'Pasos', en: 'Steps', pt: 'Passos' },
  'canvas.integrations_count': { es: 'Integraciones', en: 'Integrations', pt: 'Integrações' },
  'canvas.spec': { es: 'Generar Ficha Técnica', en: 'Generate Technical Sheet', pt: 'Gerar Ficha Técnica' },
  'canvas.saved': { es: 'Guardado', en: 'Saved', pt: 'Salvo' },
  'canvas.saving': { es: 'Guardando...', en: 'Saving...', pt: 'Salvando...' },
  'canvas.unsaved': { es: 'Sin guardar', en: 'Unsaved', pt: 'Não salvo' },
  'canvas.toastSaved': { es: 'Proyecto guardado', en: 'Project saved', pt: 'Projeto salvo' },

  // ── Node Palette ──
  'palette.search': { es: 'Buscar nodos...', en: 'Search nodes...', pt: 'Buscar nós...' },
  'palette.cat_comunicacion': { es: 'Comunicación', en: 'Communication', pt: 'Comunicação' },
  'palette.cat_logica': { es: 'Lógica', en: 'Logic', pt: 'Lógica' },
  'palette.cat_datos': { es: 'Datos', en: 'Data', pt: 'Dados' },
  'palette.cat_ia': { es: 'IA', en: 'AI', pt: 'IA' },
  'palette.cat_clasificacion': { es: 'Clasificación', en: 'Classification', pt: 'Classificação' },
  'palette.cat_integraciones': { es: 'Integraciones', en: 'Integrations', pt: 'Integrações' },

  // ── Node Types ──
  'node.message': { es: 'Mensaje', en: 'Message', pt: 'Mensagem' },
  'node.message_desc': { es: 'Enviar texto, imágenes o botones', en: 'Send text, images or buttons', pt: 'Enviar texto, imagens ou botões' },
  'node.template': { es: 'Plantilla WhatsApp', en: 'WhatsApp Template', pt: 'Template WhatsApp' },
  'node.template_desc': { es: 'Mensaje pre-aprobado por Meta', en: 'Meta pre-approved message', pt: 'Mensagem pré-aprovada pela Meta' },
  'node.eval_response': { es: 'Evaluar Respuesta', en: 'Evaluate Response', pt: 'Avaliar Resposta' },
  'node.eval_response_desc': { es: 'Bifurcar según opciones del cliente', en: 'Branch based on client options', pt: 'Bifurcar conforme opções do cliente' },
  'node.condition': { es: 'Condicional', en: 'Conditional', pt: 'Condicional' },
  'node.condition_desc': { es: 'Evaluar variable o campo', en: 'Evaluate variable or field', pt: 'Avaliar variável ou campo' },
  'node.jump': { es: 'Salto', en: 'Jump', pt: 'Salto' },
  'node.jump_desc': { es: 'Redirigir a otra parte del flujo', en: 'Redirect to another part of the flow', pt: 'Redirecionar para outra parte do fluxo' },
  'node.end': { es: 'Fin de Flujo', en: 'End of Flow', pt: 'Fim do Fluxo' },
  'node.end_desc': { es: 'Finalizar la conversación', en: 'End the conversation', pt: 'Finalizar a conversa' },
  'node.delay': { es: 'Tiempo de espera', en: 'Wait time', pt: 'Tempo de espera' },
  'node.delay_desc': { es: 'Pausar antes de continuar', en: 'Pause before continuing', pt: 'Pausar antes de continuar' },
  'node.save_field': { es: 'Guardar Campo', en: 'Save Field', pt: 'Salvar Campo' },
  'node.save_field_desc': { es: 'Almacenar dato del cliente', en: 'Store client data', pt: 'Armazenar dado do cliente' },
  'node.location': { es: 'Ubicación', en: 'Location', pt: 'Localização' },
  'node.location_desc': { es: 'Solicitar ubicación al cliente', en: 'Request client location', pt: 'Solicitar localização ao cliente' },
  'node.smarton': { es: 'Smarton - Agente IA', en: 'Smarton - AI Agent', pt: 'Smarton - Agente IA' },
  'node.smarton_desc': { es: 'IA conversacional con conocimiento', en: 'Conversational AI with knowledge', pt: 'IA conversacional com conhecimento' },
  'node.format': { es: 'Formatear', en: 'Format', pt: 'Formatar' },
  'node.format_desc': { es: 'Transformar datos con IA', en: 'Transform data with AI', pt: 'Transformar dados com IA' },
  'node.tag': { es: 'Etiqueta', en: 'Tag', pt: 'Etiqueta' },
  'node.tag_desc': { es: 'Clasificar conversación', en: 'Classify conversation', pt: 'Classificar conversa' },
  'node.customer_stage': { es: 'Etapa del Cliente', en: 'Customer Stage', pt: 'Etapa do Cliente' },
  'node.customer_stage_desc': { es: 'Avanzar en funnel de ventas', en: 'Advance in sales funnel', pt: 'Avançar no funil de vendas' },
  'node.typification': { es: 'Tipificación', en: 'Typification', pt: 'Tipificação' },
  'node.typification_desc': { es: 'Categorizar motivo de cierre', en: 'Categorize closing reason', pt: 'Categorizar motivo de fechamento' },
  'node.assign_group': { es: 'Asignar a Grupo', en: 'Assign to Group', pt: 'Atribuir a Grupo' },
  'node.assign_group_desc': { es: 'Transferir a equipo humano', en: 'Transfer to human team', pt: 'Transferir para equipe humana' },
  'node.crm': { es: 'CRM', en: 'CRM', pt: 'CRM' },
  'node.crm_desc': { es: 'Conectar con HubSpot, Salesforce...', en: 'Connect with HubSpot, Salesforce...', pt: 'Conectar com HubSpot, Salesforce...' },
  'node.payment': { es: 'Pasarela de pago', en: 'Payment gateway', pt: 'Gateway de pagamento' },
  'node.payment_desc': { es: 'Procesar pagos (Stripe, etc)', en: 'Process payments (Stripe, etc)', pt: 'Processar pagamentos (Stripe, etc)' },
  'node.database_api': { es: 'Base de datos / API externa', en: 'Database / External API', pt: 'Banco de dados / API externa' },
  'node.database_api_desc': { es: 'Consultar sistemas externos', en: 'Query external systems', pt: 'Consultar sistemas externos' },
  'node.meta_capi': { es: 'Conversión API Meta', en: 'Meta CAPI', pt: 'Conversão API Meta' },
  'node.meta_capi_desc': { es: 'Tracking de conversiones Meta', en: 'Meta conversion tracking', pt: 'Rastreamento de conversões Meta' },

  // ── Node Inspector ──
  'inspector.title': { es: 'Inspector de Nodo', en: 'Node Inspector', pt: 'Inspetor de Nó' },
  'inspector.noSelection': { es: 'Selecciona un nodo en el canvas para editarlo', en: 'Select a node on the canvas to edit it', pt: 'Selecione um nó no canvas para editá-lo' },
  'inspector.label': { es: 'Título', en: 'Title', pt: 'Título' },
  'inspector.description': { es: 'Descripción', en: 'Description', pt: 'Descrição' },
  'inspector.variable': { es: 'Nombre de variable', en: 'Variable name', pt: 'Nome da variável' },
  'inspector.systemName': { es: 'Nombre del sistema', en: 'System name', pt: 'Nome do sistema' },
  'inspector.options': { es: 'Opciones', en: 'Options', pt: 'Opções' },
  'inspector.addOption': { es: '+ Agregar opción', en: '+ Add option', pt: '+ Adicionar opção' },
  'inspector.comments': { es: 'Comentarios', en: 'Comments', pt: 'Comentários' },
  'inspector.addComment': { es: 'Agregar comentario', en: 'Add comment', pt: 'Adicionar comentário' },
  'inspector.author': { es: 'Autor', en: 'Author', pt: 'Autor' },
  'inspector.author_especialista': { es: 'Especialista Onboarding', en: 'Onboarding Specialist', pt: 'Especialista Onboarding' },
  'inspector.author_cliente': { es: 'Cliente', en: 'Client', pt: 'Cliente' },
  'inspector.author_dev': { es: 'Desarrollador', en: 'Developer', pt: 'Desenvolvedor' },
  'inspector.branches': { es: 'ramas', en: 'branches', pt: 'ramificações' },

  // ── Ficha Técnica ──
  'ficha.title': { es: 'Ficha Técnica de Implementación', en: 'Implementation Technical Sheet', pt: 'Ficha Técnica de Implementação' },
  'ficha.subtitle': { es: 'Documento técnico auto-generado para', en: 'Auto-generated technical document for', pt: 'Documento técnico auto-gerado para' },
  'ficha.loading': { es: 'Generando Ficha Técnica...', en: 'Generating Technical Sheet...', pt: 'Gerando Ficha Técnica...' },
  'ficha.loadingDesc': { es: 'Analizando estructura del flujo, nodos de integración, variables y acuerdos.', en: 'Analyzing flow structure, integration nodes, variables and agreements.', pt: 'Analisando estrutura do fluxo, nós de integração, variáveis e acordos.' },
  'ficha.copyFull': { es: 'Copiar ficha técnica', en: 'Copy technical sheet', pt: 'Copiar ficha técnica' },
  'ficha.copyClient': { es: 'Copiar resumen para cliente', en: 'Copy client summary', pt: 'Copiar resumo para cliente' },
  'ficha.exportFlow': { es: 'Exportar FlowBuilder', en: 'Export FlowBuilder', pt: 'Exportar FlowBuilder' },
  'ficha.exportFlowGen': { es: 'Generando...', en: 'Generating...', pt: 'Gerando...' },
  'ficha.downloadJSON': { es: 'Descargar JSON del flujo', en: 'Download flow JSON', pt: 'Baixar JSON do fluxo' },
  'ficha.regenerate': { es: 'Regenerar', en: 'Regenerate', pt: 'Regenerar' },
  'ficha.copied': { es: '¡Copiado!', en: 'Copied!', pt: 'Copiado!' },
  'ficha.flowHint': { es: 'Haz clic en Exportar FlowBuilder para descargar el flow_plan.json listo para importar en ATOM.', en: 'Click Export FlowBuilder to download the flow_plan.json ready to import into ATOM.', pt: 'Clique em Exportar FlowBuilder para baixar o flow_plan.json pronto para importar no ATOM.' },

  // ── Comments ──
  'comments.title': { es: 'Comentarios del flujo', en: 'Flow comments', pt: 'Comentários do fluxo' },

  // ── Industries ──
  'industry.ecommerce': { es: 'E-commerce', en: 'E-commerce', pt: 'E-commerce' },
  'industry.salud': { es: 'Salud', en: 'Health', pt: 'Saúde' },
  'industry.financiero': { es: 'Servicios Financieros', en: 'Financial Services', pt: 'Serviços Financeiros' },
  'industry.inmobiliario': { es: 'Inmobiliario', en: 'Real Estate', pt: 'Imobiliário' },
  'industry.educacion': { es: 'Educación', en: 'Education', pt: 'Educação' },
  'industry.otro': { es: 'Otro', en: 'Other', pt: 'Outro' },

  // ── General ──
  'gen.loading': { es: 'Cargando...', en: 'Loading...', pt: 'Carregando...' },
  'gen.save': { es: 'Guardar', en: 'Save', pt: 'Salvar' },
  'gen.close': { es: 'Cerrar', en: 'Close', pt: 'Fechar' },
};

// ── Context ──
interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, ...args: string[]) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'es',
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(LANG_KEY) : null;
    return (stored as Language) || 'es';
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  }, []);

  const t = useCallback((key: string, ...args: string[]) => {
    const entry = translations[key];
    let str = entry ? (entry[lang] || entry['es'] || key) : key;
    args.forEach((a, i) => { str = str.replace(`{${i}}`, a); });
    return str;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

// For non-React usage
export { translations };
