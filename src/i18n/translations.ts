export type Language = 'SP' | 'EN' | 'PT';

export const translations = {
  SP: {
    // General & Header
    appTitle: 'Atom Chat • Onboarding',
    appSubtitle: 'Diseñador de Flujos WhatsApp & Ficha Técnica',
    languageLabel: 'Idioma de la Pantalla:',

    // Initial Screen (Project List) & Hero Banner
    heroTag: 'Herramienta de Compartición de Pantalla en Vivo',
    heroTitle: 'Diseña la arquitectura de WhatsApp frente a tu cliente',
    heroDesc: 'Conecta bloques de mensajes, evaluaciones de respuesta, reglas de negocio e integraciones externas. Al finalizar la videollamada, genera la Ficha Técnica oficial impulsada por IA.',
    heroBtn: 'Iniciar Mapeo con Cliente',
    projectsTitle: 'Proyectos & Flujos de Clientes',
    projectsSubtitle: 'Herramienta para especialistas de onboarding de Atom Chat. Diseña flujos conversacionales y genera especificaciones técnicas en tiempo real.',
    btnNewProject: 'Nuevo Proyecto',
    searchPlaceholder: 'Buscar por cliente o industria...',
    filterAllIndustries: 'Todas las Industrias',
    filterAllLanguages: 'Todos los Idiomas',
    filterLanguage: 'Idioma:',
    
    // Stats & Badges
    statProjects: 'Proyectos Activos',
    statVersions: 'Versiones de Flujo',
    statComments: 'Puntos Abiertos',
    
    // Project Card
    cardVersion: 'Versión actual:',
    cardNodes: 'Nodos:',
    cardBlocks: 'Bloques de Flujo',
    cardVersionHistory: 'Historial de Versiones:',
    cardComments: 'Comentarios:',
    cardUpdated: 'Actualizado:',
    cardBtnOpen: 'Abrir Canvas',
    cardBtnDuplicate: 'Duplicar',
    cardBtnDelete: 'Eliminar',
    noProjectsTitle: 'No hay proyectos que coincidan',
    noProjectsDesc: 'Crea un nuevo proyecto para iniciar el mapeo del chatbot con un cliente durante tu llamada de onboarding.',
    btnCreateFirstProject: 'Crear primer proyecto',
    confirmDelete: '¿Estás seguro de que deseas eliminar este proyecto?',
    
    // New Project Modal Wizard
    wizardTitle: 'Nuevo Proyecto & Contexto del Bot',
    wizardSubtitle: 'Asistente de preparación de llamada de onboarding para',
    wizardStep1: '1. Información del proyecto',
    wizardStep2: '2. Objetivos del bot',
    wizardStep3: '3. Cierre y tipificaciones',
    
    clientNameLabel: 'Nombre del Cliente / Empresa *',
    clientNamePlaceholder: 'e.g. Tienda Moda Global, Clínica MediSalud',
    industryLabel: 'Rubro / Industria *',
    brandColorLabel: 'Color de Marca',
    logoLabel: 'Logo de la Empresa (Opcional)',
    logoUploadText: 'Cargar logotipo en PNG/JPG',
    flowLanguageLabel: 'Idioma Predeterminado del Flujo *',
    
    brandToneLabel: 'Tono de Marca',
    brandToneFormal: 'Formal y profesional',
    brandToneFriendly: 'Cercano y amigable',
    brandToneCasual: 'Juvenil y casual',
    brandToneTechnical: 'Técnico y directo',
    toneDetailsLabel: 'Detalles del Tono (Instrucciones)',
    toneDetailsPlaceholder: 'e.g. Siempre tutear, usar emojis moderados, jamás usar modismos',
    companyInfoLabel: 'Información General de la Empresa',
    companyInfoPlaceholder: '¿Qué hace la empresa, a quién le vende y cuál es el contexto relevante para el bot?',
    
    botGoalsLabel: '¿Qué debe lograr el bot? (Selecciona los que apliquen)',
    priorityUseCasesLabel: 'Casos de Uso Prioritarios',
    priorityUseCasesPlaceholder: 'e.g. Responder precio del catálogo, derivar clientes VIP a un asesor de ventas...',
    whatNotToDoLabel: '¿Qué NO debe hacer el bot? (Opcional)',
    whatNotToDoPlaceholder: 'e.g. No ofrecer descuentos adicionales sin cupón válido...',
    humanHandoffLabel: '¿Cuándo debe derivar a un humano?',
    humanHandoffPlaceholder: 'e.g. Cuando el usuario escriba "asesor" o tras 2 intentos no entendidos...',
    integrationsLabel: 'Integraciones Esperadas',
    
    successfulEndingLabel: '¿Cómo termina una conversación exitosa?',
    successfulEndingPlaceholder: 'e.g. El cliente recibe el enlace de pago o cita confirmada...',
    typificationsLabel: 'Tipificaciones de Cierre a Utilizar en Atom',
    addTypificationPlaceholder: 'Agregar tipificación personalizada (e.g. Venta Cerrada)',
    funnelStagesLabel: 'Etapas del Funnel que el Bot Debe Marcar',
    suggestedTagsLabel: 'Etiquetas Iniciales Sugeridas (Tags Atom)',
    tagPlaceholder: 'Escribe etiqueta y presiona Enter...',
    
    btnBack: 'Atrás',
    btnNext: 'Siguiente',
    btnCancel: 'Cancelar',
    btnCreateProject: 'Crear Proyecto & Abrir Canvas',
    
    // Canvas Editor Toolbar & Header
    btnBackToProjects: 'Volver a Proyectos',
    versionLabel: 'Versión:',
    btnNewVersion: 'Nueva Versión',
    btnDuplicateVersion: 'Duplicar Versión',
    btnContextDrawer: 'Contexto',
    btnCommentsDrawer: 'Comentarios',
    btnGenerateSpec: 'Generar Ficha Técnica',
    btnSave: 'Guardar',
    
    undoTooltip: 'Deshacer (Ctrl+Z)',
    redoTooltip: 'Rehacer (Ctrl+Shift+Z)',
    
    // Node Palette
    paletteTitle: 'Librería de Componentes',
    catMessages: 'Mensajes & Flujo',
    catCapture: 'Captura de Datos',
    catLogic: 'Lógica',
    catIntegrations: 'Integraciones Atom',
    
    // Node Inspector
    inspectorTitle: 'Propiedades del Nodo',
    inspectorLabelText: 'Etiqueta del Nodo',
    inspectorDescriptionText: 'Texto o Instrucción del Mensaje',
    inspectorFieldName: 'Nombre de la Variable / Campo',
    inspectorFieldScope: 'Tipo de Almacenamiento',
    scopePermanent: 'Campo de información (Permanente)',
    scopePermanentDesc: 'Se guarda en la ficha del cliente en Atom CRM para futuros contactos.',
    scopeTemporary: 'Variable de flujo (Temporal)',
    scopeTemporaryDesc: 'Solo vive durante la ejecución del flujo activo.',
    inspectorOptions: 'Opciones de Respuesta',
    addOptionBtn: 'Añadir Opción',
    
    // Contexto Drawer
    contextDrawerTitle: 'Contexto & Objetivos del Bot',
    contextSec1: '1. Empresa & Tono de Marca',
    contextSec2: '2. Objetivos del Bot',
    contextSec3: '3. Cierre & Configuración Atom',
    
    // Ficha Técnica Modal
    specModalTitle: 'Ficha Técnica de Implementación Atom',
    specModalSubtitle: 'Documento de especificación generado para entrega e integración en Atom Chat',
    btnCopyMarkdown: 'Copiar Markdown',
    btnDownloadMD: 'Descargar .MD',
    btnClose: 'Cerrar',
    markdownCopied: '¡Markdown copiado al portapapeles!',
    
    // Toast
    savedToast: 'Cambios guardados correctamente',
  },
  
  EN: {
    // General & Header
    appTitle: 'Atom Chat • Onboarding',
    appSubtitle: 'WhatsApp Flow Designer & Technical Spec Generator',
    languageLabel: 'Screen Language:',

    // Initial Screen (Project List) & Hero Banner
    heroTag: 'Live Screen Sharing Tool',
    heroTitle: 'Design WhatsApp architecture directly with your client',
    heroDesc: 'Connect message blocks, response evaluations, business rules, and external integrations. When the call ends, generate the official AI-powered Tech Spec.',
    heroBtn: 'Start Mapping with Client',
    projectsTitle: 'Projects & Client Flows',
    projectsSubtitle: 'Tool for Atom Chat onboarding specialists. Design conversational flows and generate technical specifications in real time.',
    btnNewProject: 'New Project',
    searchPlaceholder: 'Search by client or industry...',
    filterAllIndustries: 'All Industries',
    filterAllLanguages: 'All Languages',
    filterLanguage: 'Language:',
    
    // Stats & Badges
    statProjects: 'Active Projects',
    statVersions: 'Flow Versions',
    statComments: 'Open Items',
    
    // Project Card
    cardVersion: 'Current version:',
    cardNodes: 'Nodes:',
    cardBlocks: 'Flow Blocks',
    cardVersionHistory: 'Version History:',
    cardComments: 'Comments:',
    cardUpdated: 'Updated:',
    cardBtnOpen: 'Open Canvas',
    cardBtnDuplicate: 'Duplicate',
    cardBtnDelete: 'Delete',
    noProjectsTitle: 'No matching projects found',
    noProjectsDesc: 'Create a new project to start mapping the chatbot with a client during your onboarding call.',
    btnCreateFirstProject: 'Create first project',
    confirmDelete: 'Are you sure you want to delete this project?',
    
    // New Project Modal Wizard
    wizardTitle: 'New Project & Bot Context',
    wizardSubtitle: 'Onboarding call preparation wizard for',
    wizardStep1: '1. Project Information',
    wizardStep2: '2. Bot Objectives',
    wizardStep3: '3. Closure & Typifications',
    
    clientNameLabel: 'Client / Company Name *',
    clientNamePlaceholder: 'e.g. Global Fashion Store, MediHealth Clinic',
    industryLabel: 'Industry *',
    brandColorLabel: 'Brand Color',
    logoLabel: 'Company Logo (Optional)',
    logoUploadText: 'Upload PNG/JPG logo',
    flowLanguageLabel: 'Default Flow Language *',
    
    brandToneLabel: 'Brand Tone',
    brandToneFormal: 'Formal and professional',
    brandToneFriendly: 'Warm and friendly',
    brandToneCasual: 'Youthful and casual',
    brandToneTechnical: 'Technical and direct',
    toneDetailsLabel: 'Tone Details (Instructions)',
    toneDetailsPlaceholder: 'e.g. Use emojis moderately, avoid jargon, address user warmly',
    companyInfoLabel: 'General Company Information',
    companyInfoPlaceholder: 'What does the company do, who are its clients, and what is the relevant context?',
    
    botGoalsLabel: 'What should the bot achieve? (Select all that apply)',
    priorityUseCasesLabel: 'Priority Use Cases',
    priorityUseCasesPlaceholder: 'e.g. Answer catalog prices, transfer VIP leads to sales agent...',
    whatNotToDoLabel: 'What should the bot NOT do? (Optional)',
    whatNotToDoPlaceholder: 'e.g. Do not offer custom discounts without a valid coupon...',
    humanHandoffLabel: 'When should it hand off to a human agent?',
    humanHandoffPlaceholder: 'e.g. When the user types "agent" or after 2 unrecognized inputs...',
    integrationsLabel: 'Expected Integrations',
    
    successfulEndingLabel: 'How does a successful conversation end?',
    successfulEndingPlaceholder: 'e.g. Client receives payment link or booking confirmation...',
    typificationsLabel: 'Closure Typifications to Use in Atom',
    addTypificationPlaceholder: 'Add custom typification (e.g. Sale Closed)',
    funnelStagesLabel: 'Funnel Stages for the Bot to Mark',
    suggestedTagsLabel: 'Suggested Initial Tags (Atom Tags)',
    tagPlaceholder: 'Type tag and press Enter...',
    
    btnBack: 'Back',
    btnNext: 'Next',
    btnCancel: 'Cancel',
    btnCreateProject: 'Create Project & Open Canvas',
    
    // Canvas Editor Toolbar & Header
    btnBackToProjects: 'Back to Projects',
    versionLabel: 'Version:',
    btnNewVersion: 'New Version',
    btnDuplicateVersion: 'Duplicate Version',
    btnContextDrawer: 'Context',
    btnCommentsDrawer: 'Comments',
    btnGenerateSpec: 'Generate Tech Spec',
    btnSave: 'Save',
    
    undoTooltip: 'Undo (Ctrl+Z)',
    redoTooltip: 'Redo (Ctrl+Shift+Z)',
    
    // Node Palette
    paletteTitle: 'Component Library',
    catMessages: 'Messages & Flow',
    catCapture: 'Data Capture',
    catLogic: 'Logic',
    catIntegrations: 'Atom Integrations',
    
    // Node Inspector
    inspectorTitle: 'Node Properties',
    inspectorLabelText: 'Node Label',
    inspectorDescriptionText: 'Text or Message Instruction',
    inspectorFieldName: 'Variable / Field Name',
    inspectorFieldScope: 'Storage Type',
    scopePermanent: 'Information Field (Permanent)',
    scopePermanentDesc: 'Saved to the customer profile in Atom CRM for future contacts.',
    scopeTemporary: 'Flow Variable (Temporary)',
    scopeTemporaryDesc: 'Lives only during active session flow execution.',
    inspectorOptions: 'Response Options',
    addOptionBtn: 'Add Option',
    
    // Contexto Drawer
    contextDrawerTitle: 'Bot Context & Objectives',
    contextSec1: '1. Company & Brand Tone',
    contextSec2: '2. Bot Objectives',
    contextSec3: '3. Closure & Atom Settings',
    
    // Ficha Técnica Modal
    specModalTitle: 'Atom Implementation Technical Specification',
    specModalSubtitle: 'Specification document generated for delivery and setup in Atom Chat',
    btnCopyMarkdown: 'Copy Markdown',
    btnDownloadMD: 'Download .MD',
    btnClose: 'Close',
    markdownCopied: 'Markdown copied to clipboard!',
    
    // Toast
    savedToast: 'Changes saved successfully',
  },

  PT: {
    // General & Header
    appTitle: 'Atom Chat • Onboarding',
    appSubtitle: 'Designer de Fluxos do WhatsApp & Gerador de Ficha Técnica',
    languageLabel: 'Idioma da Tela:',

    // Initial Screen (Project List) & Hero Banner
    heroTag: 'Ferramenta de Compartilhamento de Tela ao Vivo',
    heroTitle: 'Projete a arquitetura do WhatsApp diretamente com seu cliente',
    heroDesc: 'Conecte blocos de mensagens, avaliações de resposta, regras de negócio e integrações externas. Ao finalizar a chamada, gere a Ficha Técnica oficial com IA.',
    heroBtn: 'Iniciar Mapeamento com Cliente',
    projectsTitle: 'Projetos e Fluxos de Clientes',
    projectsSubtitle: 'Ferramenta para especialistas de onboarding do Atom Chat. Projete fluxos conversacionais e gere especificações técnicas em tempo real.',
    btnNewProject: 'Novo Projeto',
    searchPlaceholder: 'Buscar por cliente ou indústria...',
    filterAllIndustries: 'Todas as Indústrias',
    filterAllLanguages: 'Todos os Idiomas',
    filterLanguage: 'Idioma:',
    
    // Stats & Badges
    statProjects: 'Projetos Ativos',
    statVersions: 'Versões do Fluxo',
    statComments: 'Pontos Abertos',
    
    // Project Card
    cardVersion: 'Versão atual:',
    cardNodes: 'Nós:',
    cardBlocks: 'Blocos de Fluxo',
    cardVersionHistory: 'Histórico de Versões:',
    cardComments: 'Comentários:',
    cardUpdated: 'Atualizado:',
    cardBtnOpen: 'Abrir Canvas',
    cardBtnDuplicate: 'Duplicar',
    cardBtnDelete: 'Excluir',
    noProjectsTitle: 'Nenhum projeto encontrado',
    noProjectsDesc: 'Crie um novo projeto para iniciar o mapeamento do chatbot com um cliente durante a chamada de onboarding.',
    btnCreateFirstProject: 'Criar primeiro projeto',
    confirmDelete: 'Tem certeza de que deseja excluir este projeto?',
    
    // New Project Modal Wizard
    wizardTitle: 'Novo Projeto e Contexto do Bot',
    wizardSubtitle: 'Assistente de preparação de chamada de onboarding para',
    wizardStep1: '1. Informações do Projeto',
    wizardStep2: '2. Objetivos do Bot',
    wizardStep3: '3. Encerramento e Tipificações',
    
    clientNameLabel: 'Nome do Cliente / Empresa *',
    clientNamePlaceholder: 'ex. Loja Moda Global, Clínica MediSaúde',
    industryLabel: 'Setor / Indústria *',
    brandColorLabel: 'Cor da Marca',
    logoLabel: 'Logo da Empresa (Opcional)',
    logoUploadText: 'Carregar logotipo em PNG/JPG',
    flowLanguageLabel: 'Idioma Padrão do Fluxo *',
    
    brandToneLabel: 'Tom da Marca',
    brandToneFormal: 'Formal e profissional',
    brandToneFriendly: 'Próximo e amigável',
    brandToneCasual: 'Jovem e casual',
    brandToneTechnical: 'Técnico e direto',
    toneDetailsLabel: 'Detalhes do Tom (Instruções)',
    toneDetailsPlaceholder: 'ex. Usar emojis moderadamente, evitar jargões, tratar de forma acolhedora',
    companyInfoLabel: 'Informações Gerais da Empresa',
    companyInfoPlaceholder: 'O que a empresa faz, para quem vende e qual é o contexto relevante?',
    
    botGoalsLabel: 'O que o bot deve alcançar? (Selecione todos que se aplicam)',
    priorityUseCasesLabel: 'Casos de Uso Prioritários',
    priorityUseCasesPlaceholder: 'ex. Responder preços de catálogo, encaminhar leads VIP para vendedor...',
    whatNotToDoLabel: 'O que o bot NÃO deve fazer? (Opcional)',
    whatNotToDoPlaceholder: 'ex. Não oferecer descontos adicionais sem cupom válido...',
    humanHandoffLabel: 'Quando deve encaminhar para um atendente humano?',
    humanHandoffPlaceholder: 'ex. Quando o usuário digitar "atendente" ou após 2 tentativas não compreendidas...',
    integrationsLabel: 'Integrações Esperadas',
    
    successfulEndingLabel: 'Como termina uma conversa bem-sucedida?',
    successfulEndingPlaceholder: 'ex. O cliente recebe o link de pagamento ou confirmação de agendamento...',
    typificationsLabel: 'Tipificações de Encerramento no Atom',
    addTypificationPlaceholder: 'Adicionar tipificação personalizada (ex. Venda Fechada)',
    funnelStagesLabel: 'Etapas do Funil para o Bot Marcar',
    suggestedTagsLabel: 'Tags Iniciais Sugeridas (Tags Atom)',
    tagPlaceholder: 'Digite a tag e pressione Enter...',
    
    btnBack: 'Voltar',
    btnNext: 'Avançar',
    btnCancel: 'Cancelar',
    btnCreateProject: 'Criar Projeto e Abrir Canvas',
    
    // Canvas Editor Toolbar & Header
    btnBackToProjects: 'Voltar para Projetos',
    versionLabel: 'Versão:',
    btnNewVersion: 'Nova Versão',
    btnDuplicateVersion: 'Duplicar Versão',
    btnContextDrawer: 'Contexto',
    btnCommentsDrawer: 'Comentários',
    btnGenerateSpec: 'Gerar Ficha Técnica',
    btnSave: 'Salvar',
    
    undoTooltip: 'Desfazer (Ctrl+Z)',
    redoTooltip: 'Refazer (Ctrl+Shift+Z)',
    
    // Node Palette
    paletteTitle: 'Biblioteca de Componentes',
    catMessages: 'Mensagens & Fluxo',
    catCapture: 'Captura de Dados',
    catLogic: 'Lógica',
    catIntegrations: 'Integrações Atom',
    
    // Node Inspector
    inspectorTitle: 'Propriedades do Nó',
    inspectorLabelText: 'Rótulo do Nó',
    inspectorDescriptionText: 'Texto ou Instrução da Mensagem',
    inspectorFieldName: 'Nome da Variável / Campo',
    inspectorFieldScope: 'Tipo de Armazenamento',
    scopePermanent: 'Campo de Informação (Permanente)',
    scopePermanentDesc: 'Salvo na ficha do cliente no Atom CRM para futuros contatos.',
    scopeTemporary: 'Variável de Fluxo (Temporal)',
    scopeTemporaryDesc: 'Existe apenas durante a execução da sessão ativa.',
    inspectorOptions: 'Opções de Resposta',
    addOptionBtn: 'Adicionar Opção',
    
    // Contexto Drawer
    contextDrawerTitle: 'Contexto & Objetivos do Bot',
    contextSec1: '1. Empresa & Tom da Marca',
    contextSec2: '2. Objetivos do Bot',
    contextSec3: '3. Configurações Atom & Cierre',
    
    // Ficha Técnica Modal
    specModalTitle: 'Ficha Técnica de Implementação Atom',
    specModalSubtitle: 'Documento de especificação gerado para entrega e configuração no Atom Chat',
    btnCopyMarkdown: 'Copiar Markdown',
    btnDownloadMD: 'Baixar .MD',
    btnClose: 'Fechar',
    markdownCopied: 'Markdown copiado para a área de transferência!',
    
    // Toast
    savedToast: 'Alterações salvas com sucesso',
  },
};
