import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en' | 'pt';

export interface Translations {
  // Header
  appName: string;
  engineName: string;
  flowNamePlaceholder: string;
  stepsCount: string;
  nodesCount: string;
  connectionsCount: string;
  aiSuggestionsBtn: string;
  simulatorBtn: string;
  flowPlanBtn: string;
  generateSpecBtn: string;

  // Sidebar / Palette
  tabNodes: string;
  tabProject: string;
  tabTemplates: string;

  catMessages: string;
  catInteraction: string;
  catAi: string;
  catLogic: string;
  catIntegrations: string;

  // Node Labels & Descriptions
  nodeMessageLabel: string;
  nodeMessageDesc: string;
  nodeTemplateLabel: string;
  nodeTemplateDesc: string;
  nodeEvalResponseLabel: string;
  nodeEvalResponseDesc: string;
  nodeDelayLabel: string;
  nodeDelayDesc: string;
  nodeSmartonLabel: string;
  nodeSmartonDesc: string;
  nodeSaveFieldLabel: string;
  nodeSaveFieldDesc: string;
  nodeConditionLabel: string;
  nodeConditionDesc: string;
  nodeTagLabel: string;
  nodeTagDesc: string;
  nodeCustomerStageLabel: string;
  nodeCustomerStageDesc: string;
  nodeCrmLabel: string;
  nodeCrmDesc: string;
  nodeAssignGroupLabel: string;
  nodeAssignGroupDesc: string;
  nodeTypificationLabel: string;
  nodeTypificationDesc: string;
  nodeJumpLabel: string;
  nodeJumpDesc: string;
  nodeFormatLabel: string;
  nodeFormatDesc: string;

  // Node display text (inline labels on canvas nodes)
  nodeEvalOptions: string;
  nodeEvalTimeout: string;
  nodeSmartonIntents: string;
  nodeCrmSuccess: string;
  nodeCrmFailure: string;
  nodeDelayText: string;
  nodeFieldLabel: string;

  // Project Metadata Form
  projectMetadataTitle: string;
  projectNameLabel: string;
  clientNameLabel: string;
  industryLabel: string;
  objectiveLabel: string;
  authorLabel: string;
  saveProjectInfo: string;

  // Industries
  indEcommerce: string;
  indHealth: string;
  indFinancial: string;
  indRealEstate: string;
  indEducation: string;
  indRetail: string;
  indOther: string;

  // Projects & Templates
  myProjects: string;
  createProject: string;
  searchPlaceholder: string;
  templatesTitle: string;
  templatesDesc: string;
  loadTemplateBtn: string;

  // Node Inspector
  inspectorTitle: string;
  nodeTypeLabel: string;
  nodeTitleInput: string;
  nodeDescInput: string;
  buttonOptionsLabel: string;
  addOptionBtn: string;
  fieldNameLabel: string;
  commentsLabel: string;
  commentsPlaceholder: string;
  deleteNodeBtn: string;

  // Ficha Tecnica Modal
  specModalTitle: string;
  specModalSubtitle: string;
  specGenerateBtn: string;
  specCopyBtn: string;
  specCopied: string;
  specRegenerateBtn: string;
  copyClientSummaryBtn: string;
  downloadFlowJsonBtn: string;
  exportFlowBuilderBtn: string;
  generatingSpecMsg: string;

  // WhatsApp Simulator Modal
  simTitle: string;
  simStatus: string;
  simRestartTooltip: string;
  simInputPlaceholder: string;
  simNoNodesMsg: string;
  simEndMsg: string;

  // FlowPlan Export Modal
  exportTitle: string;
  exportSubtitle: string;
  exportValidityMsg: string;
  copyJsonBtn: string;
  downloadJsonBtn: string;

  // AI Assistant Modal
  aiModalTitle: string;
  aiModalSubtitle: string;
  aiInputPlaceholder: string;
  aiGenerateBtn: string;
  aiQuickSuggestions: string;
  aiQuickOpt1: string;
  aiQuickOpt2: string;
  aiQuickOpt3: string;
  aiThinkingMsg: string;
  aiRecommendationsTitle: string;
  aiFlowGeneratedMsg: string;
  aiApplyToCanvasBtn: string;

  // Comments / Misc
  commentsDrawerTitle: string;
  addCommentPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Header
    appName: 'Atom Scope Builder',
    engineName: 'WhatsApp Engine',
    flowNamePlaceholder: 'Nombre del Flujo...',
    stepsCount: '{count} Pasos',
    nodesCount: '{count} Nodos',
    connectionsCount: '{count} Conexiones',
    aiSuggestionsBtn: 'Sugerencias IA',
    simulatorBtn: 'Simulador WhatsApp',
    flowPlanBtn: 'FlowPlan JSON',
    generateSpecBtn: 'Generar Ficha TÃ©cnica IA',

    // Sidebar
    tabNodes: 'Componentes',
    tabProject: 'Proyecto',
    tabTemplates: 'Plantillas',

    catMessages: 'ð¬ ComunicaciÃ³n & Contenido',
    catInteraction: 'ð InteracciÃ³n & MenÃºs',
    catAi: 'ð¤ Inteligencia Artificial',
    catLogic: 'ð§  LÃ³gica & Datos',
    catIntegrations: 'ð Integraciones & CRM',

    // Node Labels & Descriptions
    nodeMessageLabel: 'Mensaje de Texto',
    nodeMessageDesc: 'EnvÃ­a un mensaje de texto plano con variables.',
    nodeTemplateLabel: 'Plantilla WhatsApp (HSM)',
    nodeTemplateDesc: 'Mensaje pre-aprobado por Meta (Template).',
    nodeEvalResponseLabel: 'Evaluar Botones',
    nodeEvalResponseDesc: 'Muestra opciones interactivas (1-3 botones).',
    nodeDelayLabel: 'Espera / Delay',
    nodeDelayDesc: 'AÃ±ade una pausa temporal antes del siguiente paso.',
    nodeSmartonLabel: 'Smarton AI Assistant',
    nodeSmartonDesc: 'Respuesta generativa en tiempo real con Inteligencia Artificial.',
    nodeSaveFieldLabel: 'Guardar Campo',
    nodeSaveFieldDesc: 'Almacena la respuesta del usuario en una variable.',
    nodeConditionLabel: 'Condicional (If/Else)',
    nodeConditionDesc: 'Bifurca el flujo segÃºn el valor de una variable.',
    nodeTagLabel: 'Etiquetar Contacto',
    nodeTagDesc: 'AÃ±ade un tag al perfil del cliente.',
    nodeCustomerStageLabel: 'Etapa del Cliente',
    nodeCustomerStageDesc: 'Actualiza el embudo de ventas (Funnel Stage).',
    nodeCrmLabel: 'IntegraciÃ³n HTTP / CRM',
    nodeCrmDesc: 'Llamada API a CRM, ERP o sistema externo.',
    nodeAssignGroupLabel: 'Asignar Asesor',
    nodeAssignGroupDesc: 'Transfiere la conversaciÃ³n a un agente o equipo humano.',
    nodeTypificationLabel: 'TipificaciÃ³n / Cierre',
    nodeTypificationDesc: 'Cierra el ticket y registra la resoluciÃ³n final.',
    nodeJumpLabel: 'Salto de Flujo',
    nodeJumpDesc: 'Redirige a otro bloque o submÃ³dulo del diagrama.',
    nodeFormatLabel: 'Formatear Dato',
    nodeFormatDesc: 'Transforma cadenas de texto, nÃºmeros o fechas.',
    nodeEvalOptions: 'Opciones de Botón:',
    nodeEvalTimeout: 'Sin respuesta (Timeout)',
    nodeSmartonIntents: 'Intenciones Detectadas:',
    nodeCrmSuccess: 'Exitosa (200 OK)',
    nodeCrmFailure: 'Fallida (Error API)',
    nodeDelayText: 'Esperar {0} minutos',
    nodeFieldLabel: 'Campo:',

    // Project Metadata
    projectMetadataTitle: 'InformaciÃ³n General del Proyecto',
    projectNameLabel: 'Nombre del Proyecto',
    clientNameLabel: 'Nombre del Cliente / Empresa',
    industryLabel: 'Industria / Sector',
    objectiveLabel: 'Objetivo Comercial',
    authorLabel: 'Autor / Arquitecto de SoluciÃ³n',
    saveProjectInfo: 'Guardar Cambios de Proyecto',

    // Industries
    indEcommerce: 'E-commerce & Retail',
    indHealth: 'Salud & Medicina',
    indFinancial: 'Servicios Financieros & Banca',
    indRealEstate: 'Inmobiliario & Real Estate',
    indEducation: 'EducaciÃ³n & Cursos',
    indRetail: 'Retail & Comercio',
    indOther: 'Otro Sector',

    // Projects & Templates
    myProjects: 'Mis Proyectos',
    createProject: 'Crear Nuevo Proyecto',
    searchPlaceholder: 'Buscar proyectos o flujos...',
    templatesTitle: 'Plantillas Predefinidas',
    templatesDesc: 'Acelera el diseÃ±o usando flujos de trabajo previamente aprobados por la industria.',
    loadTemplateBtn: 'Cargar Flujo',

    // Node Inspector
    inspectorTitle: 'Inspector de Nodo',
    nodeTypeLabel: 'Tipo de Nodo',
    nodeTitleInput: 'TÃ­tulo del Nodo',
    nodeDescInput: 'DescripciÃ³n / Contenido',
    buttonOptionsLabel: 'Opciones de Botones / Salidas',
    addOptionBtn: 'AÃ±adir OpciÃ³n',
    fieldNameLabel: 'Nombre de Variable',
    commentsLabel: 'Comentarios y Notas',
    commentsPlaceholder: 'Escribe notas tÃ©cnicas o aclaraciones para la Ficha TÃ©cnica...',
    deleteNodeBtn: 'Eliminar Nodo',

    // Ficha Tecnica Modal
    specModalTitle: 'Ficha TÃ©cnica Oficial del Proyecto (IA Generated)',
    specModalSubtitle: 'Documento tÃ©cnico arquitectÃ³nico listo para presentar al cliente o equipo tÃ©cnico.',
    specGenerateBtn: 'Generar Ficha TÃ©cnica con IA',
    specCopyBtn: 'Copiar Ficha TÃ©cnica',
    specCopied: 'Â¡Copiado!',
    specRegenerateBtn: 'Regenerar Documento',
    copyClientSummaryBtn: 'Copiar Resumen para Cliente',
    downloadFlowJsonBtn: 'Descargar JSON del Flujo',
    exportFlowBuilderBtn: 'Exportar a FlowBuilder',
    generatingSpecMsg: 'Generando documento tÃ©cnico estructurado con Gemini AI...',

    // WhatsApp Simulator
    simTitle: 'Simulador WhatsApp Live',
    simStatus: 'En lÃ­nea (Simulador Live)',
    simRestartTooltip: 'Reiniciar SimulaciÃ³n',
    simInputPlaceholder: 'Escribe un mensaje...',
    simNoNodesMsg: 'El diagrama no contiene nodos para simular.',
    simEndMsg: 'Fin del flujo interactivo.',

    // FlowPlan Export
    exportTitle: 'ExportaciÃ³n de FlowPlan JSON',
    exportSubtitle: 'Estructura estÃ¡ndar compatible con Atom Engine y herramientas de despliegue.',
    exportValidityMsg: 'Validez del Esquema: {nodes} Nodos & {edges} Conexiones',
    copyJsonBtn: 'Copiar JSON',
    downloadJsonBtn: 'Descargar .json',

    // AI Assistant Modal
    aiModalTitle: 'Asistente de DiseÃ±o de Flujos Gemini AI',
    aiModalSubtitle: 'Pide optimizaciones, generaciÃ³n de prompts o creaciÃ³n automÃ¡tica de diagramas.',
    aiInputPlaceholder: "Ej: 'DiseÃ±a un flujo para agendamiento de citas mÃ©dicas por WhatsApp'...",
    aiGenerateBtn: 'Generar',
    aiQuickSuggestions: 'Sugerencias rÃ¡pidas:',
    aiQuickOpt1: '+ Timeout recovery',
    aiQuickOpt2: '+ Flujo Soporte TÃ©cnico',
    aiQuickOpt3: '+ Mensajes mÃ¡s breves',
    aiThinkingMsg: 'Gemini AI diseÃ±ando flujo y estructura...',
    aiRecommendationsTitle: 'Recomendaciones del Asistente:',
    aiFlowGeneratedMsg: 'Se generÃ³ una estructura con {count} nuevos nodos.',
    aiApplyToCanvasBtn: 'Aplicar al Lienzo',

    // Comments / Misc
    commentsDrawerTitle: 'Comentarios del Flujo',
    addCommentPlaceholder: 'Escribe un comentario para este nodo...',
  },

  en: {
    // Header
    appName: 'Atom Scope Builder',
    engineName: 'WhatsApp Engine',
    flowNamePlaceholder: 'Flow Name...',
    stepsCount: '{count} Steps',
    nodesCount: '{count} Nodes',
    connectionsCount: '{count} Connections',
    aiSuggestionsBtn: 'AI Suggestions',
    simulatorBtn: 'WhatsApp Simulator',
    flowPlanBtn: 'FlowPlan JSON',
    generateSpecBtn: 'Generate Technical Sheet',

    // Sidebar
    tabNodes: 'Components',
    tabProject: 'Project',
    tabTemplates: 'Templates',

    catMessages: 'ð¬ Communication & Content',
    catInteraction: 'ð Interaction & Menus',
    catAi: 'ð¤ Artificial Intelligence',
    catLogic: 'ð§  Logic & Data',
    catIntegrations: 'ð Integrations & CRM',

    // Node Labels & Descriptions
    nodeMessageLabel: 'Text Message',
    nodeMessageDesc: 'Sends a plain text message with dynamic variables.',
    nodeTemplateLabel: 'WhatsApp Template (HSM)',
    nodeTemplateDesc: 'Pre-approved message template by Meta.',
    nodeEvalResponseLabel: 'Evaluate Buttons',
    nodeEvalResponseDesc: 'Displays interactive options (1-3 buttons).',
    nodeDelayLabel: 'Wait / Delay',
    nodeDelayDesc: 'Adds a time pause before proceeding to the next step.',
    nodeSmartonLabel: 'Smarton AI Assistant',
    nodeSmartonDesc: 'Real-time generative AI responses.',
    nodeSaveFieldLabel: 'Save Field',
    nodeSaveFieldDesc: 'Stores user response inside a variable.',
    nodeConditionLabel: 'Condition (If/Else)',
    nodeConditionDesc: 'Branches the flow based on variable value.',
    nodeTagLabel: 'Tag Contact',
    nodeTagDesc: 'Adds a tag label to the customer profile.',
    nodeCustomerStageLabel: 'Customer Stage',
    nodeCustomerStageDesc: 'Updates the sales pipeline funnel stage.',
    nodeCrmLabel: 'HTTP / CRM Integration',
    nodeCrmDesc: 'API request to CRM, ERP, or external service.',
    nodeAssignGroupLabel: 'Assign Agent',
    nodeAssignGroupDesc: 'Transfers the chat to a live human agent or queue.',
    nodeTypificationLabel: 'Resolution / Closure',
    nodeTypificationDesc: 'Closes ticket and records final resolution tag.',
    nodeJumpLabel: 'Flow Jump',
    nodeJumpDesc: 'Redirects to another sub-module or diagram node.',
    nodeFormatLabel: 'Format Data',
    nodeFormatDesc: 'Transforms string text, numbers, or dates.',
    nodeEvalOptions: 'Button Options:',
    nodeEvalTimeout: 'No response (Timeout)',
    nodeSmartonIntents: 'Detected Intents:',
    nodeCrmSuccess: 'Success (200 OK)',
    nodeCrmFailure: 'Failed (API Error)',
    nodeDelayText: 'Wait {0} minutes',
    nodeFieldLabel: 'Field:',

    // Project Metadata
    projectMetadataTitle: 'Project Information',
    projectNameLabel: 'Project Name',
    clientNameLabel: 'Client / Company Name',
    industryLabel: 'Industry / Sector',
    objectiveLabel: 'Business Objective',
    authorLabel: 'Author / Solution Architect',
    saveProjectInfo: 'Save Project Details',

    // Industries
    indEcommerce: 'E-commerce & Retail',
    indHealth: 'Health & Medicine',
    indFinancial: 'Financial Services & Banking',
    indRealEstate: 'Real Estate',
    indEducation: 'Education & Courses',
    indRetail: 'Retail & Commerce',
    indOther: 'Other Sector',

    // Projects & Templates
    myProjects: 'My Projects',
    createProject: 'Create New Project',
    searchPlaceholder: 'Search projects or flows...',
    templatesTitle: 'Prebuilt Templates',
    templatesDesc: 'Accelerate design with industry pre-approved workflow blueprints.',
    loadTemplateBtn: 'Load Flow',

    // Node Inspector
    inspectorTitle: 'Node Inspector',
    nodeTypeLabel: 'Node Type',
    nodeTitleInput: 'Node Title',
    nodeDescInput: 'Description / Content',
    buttonOptionsLabel: 'Button Options / Outputs',
    addOptionBtn: 'Add Option',
    fieldNameLabel: 'Variable Name',
    commentsLabel: 'Comments & Notes',
    commentsPlaceholder: 'Write technical notes or clarifications for technical sheet...',
    deleteNodeBtn: 'Delete Node',

    // Ficha Tecnica Modal
    specModalTitle: 'Official Technical Sheet (AI Generated)',
    specModalSubtitle: 'Architectural technical specification ready for client presentation.',
    specGenerateBtn: 'Generate Technical Sheet with AI',
    specCopyBtn: 'Copy Technical Sheet',
    specCopied: 'Copied!',
    specRegenerateBtn: 'Regenerate Document',
    copyClientSummaryBtn: 'Copy Client Summary',
    downloadFlowJsonBtn: 'Download Flow JSON',
    exportFlowBuilderBtn: 'Export to FlowBuilder',
    generatingSpecMsg: 'Generating structured technical specification with Gemini AI...',

    // WhatsApp Simulator
    simTitle: 'WhatsApp Live Simulator',
    simStatus: 'Online (Live Simulator)',
    simRestartTooltip: 'Restart Simulation',
    simInputPlaceholder: 'Type a message...',
    simNoNodesMsg: 'Diagram has no nodes to simulate.',
    simEndMsg: 'Interactive flow finished.',

    // FlowPlan Export
    exportTitle: 'FlowPlan JSON Export',
    exportSubtitle: 'Standard structure compatible with Atom Engine deployment.',
    exportValidityMsg: 'Schema Validity: {nodes} Nodes & {edges} Connections',
    copyJsonBtn: 'Copy JSON',
    downloadJsonBtn: 'Download .json',

    // AI Assistant Modal
    aiModalTitle: 'Gemini AI Flow Assistant',
    aiModalSubtitle: 'Request optimizations, prompt engineering, or flow generation.',
    aiInputPlaceholder: "E.g. 'Design a medical appointment booking flow on WhatsApp'...",
    aiGenerateBtn: 'Generate',
    aiQuickSuggestions: 'Quick suggestions:',
    aiQuickOpt1: '+ Timeout recovery',
    aiQuickOpt2: '+ Tech Support Flow',
    aiQuickOpt3: '+ Shorter messages',
    aiThinkingMsg: 'Gemini AI designing flow and structure...',
    aiRecommendationsTitle: 'Assistant Recommendations:',
    aiFlowGeneratedMsg: 'Generated structure with {count} new nodes.',
    aiApplyToCanvasBtn: 'Apply to Canvas',

    // Comments / Misc
    commentsDrawerTitle: 'Flow Comments',
    addCommentPlaceholder: 'Write a comment for this node...',
  },

  pt: {
    // Header
    appName: 'Atom Scope Builder',
    engineName: 'WhatsApp Engine',
    flowNamePlaceholder: 'Nome do Fluxo...',
    stepsCount: '{count} Passos',
    nodesCount: '{count} NÃ³s',
    connectionsCount: '{count} ConexÃµes',
    aiSuggestionsBtn: 'SugestÃµes de IA',
    simulatorBtn: 'Simulador WhatsApp',
    flowPlanBtn: 'FlowPlan JSON',
    generateSpecBtn: 'Gerar Ficha TÃ©cnica',

    // Sidebar
    tabNodes: 'Componentes',
    tabProject: 'Projeto',
    tabTemplates: 'Modelos',

    catMessages: 'ð¬ ComunicaÃ§Ã£o e ConteÃºdo',
    catInteraction: 'ð InteraÃ§Ã£o e Menus',
    catAi: 'ð¤ InteligÃªncia Artificial',
    catLogic: 'ð§  LÃ³gica e Dados',
    catIntegrations: 'ð IntegraÃ§Ãµes e CRM',

    // Node Labels & Descriptions
    nodeMessageLabel: 'Mensagem de Texto',
    nodeMessageDesc: 'Envia uma mensagem de texto simples com variÃ¡veis.',
    nodeTemplateLabel: 'Modelo WhatsApp (HSM)',
    nodeTemplateDesc: 'Modelo de mensagem prÃ©-aprovado pela Meta.',
    nodeEvalResponseLabel: 'Avaliar BotÃµes',
    nodeEvalResponseDesc: 'Exibe opÃ§Ãµes interativas (1-3 botÃµes).',
    nodeDelayLabel: 'Aguardar / Delay',
    nodeDelayDesc: 'Adiciona uma pausa temporal antes do prÃ³ximo passo.',
    nodeSmartonLabel: 'Smarton AI Assistant',
    nodeSmartonDesc: 'Resposta generativa em tempo real com InteligÃªncia Artificial.',
    nodeSaveFieldLabel: 'Salvar Campo',
    nodeSaveFieldDesc: 'Armazena a resposta do usuÃ¡rio em uma variÃ¡vel.',
    nodeConditionLabel: 'Condicional (If/Else)',
    nodeConditionDesc: 'Ramifica o fluxo com base no valor da variÃ¡vel.',
    nodeTagLabel: 'Etiquetar Contato',
    nodeTagDesc: 'Adiciona uma etiqueta ao perfil do cliente.',
    nodeCustomerStageLabel: 'Etapa do Cliente',
    nodeCustomerStageDesc: 'Atualiza a etapa do funil de vendas.',
    nodeCrmLabel: 'IntegraÃ§Ã£o HTTP / CRM',
    nodeCrmDesc: 'Chamada de API para CRM, ERP ou sistema externo.',
    nodeAssignGroupLabel: 'Atribuir Atendente',
    nodeAssignGroupDesc: 'Transfere a conversa para um agente ou equipe humana.',
    nodeTypificationLabel: 'TipificaÃ§Ã£o / Fechamento',
    nodeTypificationDesc: 'Encerra o chamado e registra a resoluÃ§Ã£o final.',
    nodeJumpLabel: 'Salto de Fluxo',
    nodeJumpDesc: 'Redireciona para outro bloco do diagrama.',
    nodeFormatLabel: 'Formatar Dado',
    nodeFormatDesc: 'Transforma textos, números ou datas.',
    nodeEvalOptions: 'Opções de Botão:',
    nodeEvalTimeout: 'Sem resposta (Timeout)',
    nodeSmartonIntents: 'Intenções Detectadas:',
    nodeCrmSuccess: 'Sucesso (200 OK)',
    nodeCrmFailure: 'Falha (Erro API)',
    nodeDelayText: 'Aguardar {0} minutos',
    nodeFieldLabel: 'Campo:',

    // Project Metadata
    projectMetadataTitle: 'InformaÃ§Ãµes do Projeto',
    projectNameLabel: 'Nome do Projeto',
    clientNameLabel: 'Nome do Cliente / Empresa',
    industryLabel: 'Setor / IndÃºstria',
    objectiveLabel: 'Objetivo Comercial',
    authorLabel: 'Autor / Arquiteto de SoluÃ§Ãµes',
    saveProjectInfo: 'Salvar Detalhes do Projeto',

    // Industries
    indEcommerce: 'E-commerce e Varejo',
    indHealth: 'SaÃºde e Medicina',
    indFinancial: 'ServiÃ§os Financeiros e Bancos',
    indRealEstate: 'ImobiliÃ¡rio e Real Estate',
    indEducation: 'EducaÃ§Ã£o e Cursos',
    indRetail: 'Varejo e ComÃ©rcio',
    indOther: 'Outro Setor',

    // Projects & Templates
    myProjects: 'Meus Projetos',
    createProject: 'Criar Novo Projeto',
    searchPlaceholder: 'Buscar projetos ou fluxos...',
    templatesTitle: 'Modelos PrÃ©-definidos',
    templatesDesc: 'Acelere o design com fluxos aprovados pela indÃºstria.',
    loadTemplateBtn: 'Carregar Fluxo',

    // Node Inspector
    inspectorTitle: 'Inspetor de NÃ³',
    nodeTypeLabel: 'Tipo de NÃ³',
    nodeTitleInput: 'TÃ­tulo do NÃ³',
    nodeDescInput: 'DescriÃ§Ã£o / ConteÃºdo',
    buttonOptionsLabel: 'OpÃ§Ãµes de BotÃµes / SaÃ­das',
    addOptionBtn: 'Adicionar OpÃ§Ã£o',
    fieldNameLabel: 'Nome da VariÃ¡vel',
    commentsLabel: 'ComentÃ¡rios e Notas',
    commentsPlaceholder: 'Escreva notas tÃ©cnicas ou esclarecimentos...',
    deleteNodeBtn: 'Excluir NÃ³',

    // Ficha Tecnica Modal
    specModalTitle: 'Ficha TÃ©cnica Oficial do Projeto (Gerada por IA)',
    specModalSubtitle: 'EspecificaÃ§Ã£o tÃ©cnica arquitetÃ´nica pronta para apresentaÃ§Ã£o.',
    specGenerateBtn: 'Gerar Ficha TÃ©cnica com IA',
    specCopyBtn: 'Copiar Ficha TÃ©cnica',
    specCopied: 'Copiado!',
    specRegenerateBtn: 'Regerar Documento',
    copyClientSummaryBtn: 'Copiar Resumo para Cliente',
    downloadFlowJsonBtn: 'Baixar JSON do Fluxo',
    exportFlowBuilderBtn: 'Exportar para FlowBuilder',
    generatingSpecMsg: 'Gerando especificaÃ§Ã£o tÃ©cnica estruturada com Gemini AI...',

    // WhatsApp Simulator
    simTitle: 'Simulador WhatsApp Live',
    simStatus: 'Online (Simulador Live)',
    simRestartTooltip: 'Reiniciar SimulaÃ§Ã£o',
    simInputPlaceholder: 'Digite uma mensagem...',
    simNoNodesMsg: 'O diagrama nÃ£o possui nÃ³s para simular.',
    simEndMsg: 'Fim do fluxo interativo.',

    // FlowPlan Export
    exportTitle: 'ExportaÃ§Ã£o do FlowPlan JSON',
    exportSubtitle: 'Estrutura padrÃ£o compatÃ­vel com o Atom Engine.',
    exportValidityMsg: 'Validade do Esquema: {nodes} NÃ³s & {edges} ConexÃµes',
    copyJsonBtn: 'Copiar JSON',
    downloadJsonBtn: 'Baixar .json',

    // AI Assistant Modal
    aiModalTitle: 'Assistente de Design Gemini AI',
    aiModalSubtitle: 'PeÃ§a otimizaÃ§Ãµes, geraÃ§Ã£o de prompts ou criaÃ§Ã£o de fluxos.',
    aiInputPlaceholder: "Ex: 'Crie um fluxo para agendamento de consultas mÃ©dicas'...",
    aiGenerateBtn: 'Gerar',
    aiQuickSuggestions: 'SugestÃµes rÃ¡pidas:',
    aiQuickOpt1: '+ RecuperaÃ§Ã£o de timeout',
    aiQuickOpt2: '+ Fluxo Suporte TÃ©cnico',
    aiQuickOpt3: '+ Mensagens mais curtas',
    aiThinkingMsg: 'Gemini AI criando fluxo e estrutura...',
    aiRecommendationsTitle: 'RecomendaÃ§Ãµes do Assistente:',
    aiFlowGeneratedMsg: 'Estrutura gerada com {count} novos nÃ³s.',
    aiApplyToCanvasBtn: 'Aplicar na Tela',

    // Comments / Misc
    commentsDrawerTitle: 'ComentÃ¡rios do Fluxo',
    addCommentPlaceholder: 'Escreva um comentÃ¡rio para este nÃ³...',
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('atom_lang');
    if (saved === 'es' || saved === 'en' || saved === 'pt') {
      return saved as Language;
    }
    return 'es';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('atom_lang', newLang);
  };

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    let text = translations[lang]?.[key] || translations['es']?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([pKey, pValue]) => {
        text = text.replace(`{${pKey}}`, String(pValue));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
