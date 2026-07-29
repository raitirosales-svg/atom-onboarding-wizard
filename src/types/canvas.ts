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
  | 'meta_capi';

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
  updatedAt: string;
  currentVersionNumber: number;
  versions: ProjectVersion[];
}
