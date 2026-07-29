export type NodeType =
  // Comunicación
  | 'message'
  | 'template'
  // Lógica
  | 'eval_response'
  | 'condition'
  | 'jump'
  | 'end'
  | 'delay'
  // Datos
  | 'save_field'
  | 'location'
  // IA
  | 'smarton'
  | 'format'
  // Clasificación
  | 'tag'
  | 'customer_stage'
  | 'typification'
  | 'assign_group'
  // Integraciones
  | 'crm'
  | 'payment'
  | 'database_api'
  | 'meta_capi'
  | 'http_request'
  | 'customer_recognition';

export type NodeCategory =
  | 'Comunicación'
  | 'Lógica'
  | 'Datos'
  | 'IA'
  | 'Clasificación'
  | 'Integraciones';

export interface NodeComment {
  id: string;
  nodeId: string;
  nodeTitle?: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ProjectContexto {
  // Paso 1: Información del proyecto
  brandTone?: string;
  toneDetails?: string;
  companyInfo?: string;
  language?: 'SP' | 'EN' | 'PT';
  // Paso 2: Objetivos del bot
  botGoals?: string[];
  priorityUseCases?: string;
  whatNotToDo?: string;
  humanHandoffTrigger?: string;
  expectedIntegrations?: string[];
  // Paso 3: Cierre y tipificaciones
  successfulEnding?: string;
  typifications?: string[];
  funnelStages?: string[];
  suggestedTags?: string[];
}

export interface FlowNodeData {
  label: string;
  description: string;
  type: NodeType;
  category: NodeCategory;
  iconName: string;
  color: string;
  isIntegration?: boolean;
  options?: string[]; // for eval_response
  conditionIf?: string; // for condition
  conditionElse?: string;
  fieldName?: string; // for save_field
  fieldScope?: 'permanent' | 'temporary'; // "Campo de información (permanente)" vs "Variable de flujo (temporal)"
  systemName?: string; // for crm, payment, database_api
  comments?: NodeComment[];
}

export interface ProjectVersion {
  versionNumber: number;
  versionLabel: string;
  createdAt: string;
  nodes: any[];
  edges: any[];
  comments: NodeComment[];
}

export interface Project {
  id: string;
  name: string;
  industry: 'E-commerce' | 'Salud' | 'Servicios Financieros' | 'Inmobiliario' | 'Educación' | 'Otro';
  brandColor: string;
  logo?: string; // base64
  language?: 'SP' | 'EN' | 'PT';
  updatedAt: string;
  currentVersionNumber: number;
  versions: ProjectVersion[];
  contexto?: ProjectContexto;
}
